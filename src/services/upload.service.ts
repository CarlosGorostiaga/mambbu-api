import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { randomUUID } from 'crypto';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

export async function uploadImage(file: Express.Multer.File): Promise<string> {
  const imageId = randomUUID();

  try {
    // Optimizado para Cuba: 400px, WebP calidad 70, ultra ligero
    const processedImage = await sharp(file.buffer)
      .resize(400, null, { withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer();

    const key = `properties/${imageId}.webp`;

    await r2Client.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: processedImage,
        ContentType: 'image/webp',
      })
    );

    return `${PUBLIC_URL}/${key}`;
  } catch (error) {
    console.error('Error uploading to R2:', error);
    throw new Error('Failed to upload image');
  }
}

// ✅ Procesar en lotes para evitar saturar memoria
export async function uploadMultipleImages(files: Express.Multer.File[]): Promise<string[]> {
  const batchSize = 5; // Procesar 5 imágenes a la vez
  const results: string[] = [];

  console.log(`📸 Subiendo ${files.length} imágenes en lotes de ${batchSize}...`);

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    console.log(`   Procesando lote ${Math.floor(i / batchSize) + 1}/${Math.ceil(files.length / batchSize)} (${batch.length} imágenes)`);
    
    const batchUrls = await Promise.all(batch.map(file => uploadImage(file)));
    results.push(...batchUrls);
  }

  console.log(`✅ ${results.length} imágenes subidas correctamente`);
  return results;
}