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

// ✅ Procesar en lotes con manejo de errores parciales
export async function uploadMultipleImages(files: Express.Multer.File[]): Promise<{ 
  urls: string[], 
  failed: number 
}> {
  const batchSize = 5;
  const results: string[] = [];
  let failedCount = 0;

  console.log(`📸 Subiendo ${files.length} imágenes en lotes de ${batchSize}...`);

  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(files.length / batchSize);
    
    console.log(`   Procesando lote ${batchNum}/${totalBatches} (${batch.length} imágenes)`);
    
    try {
      // Intentar subir cada imagen del lote individualmente
      const batchResults = await Promise.allSettled(
        batch.map(file => uploadImage(file))
      );

      // Separar éxitos y fallos
      batchResults.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          results.push(result.value);
        } else {
          failedCount++;
          console.error(`   ❌ Imagen ${i + index + 1} falló:`, result.reason);
        }
      });

    } catch (error) {
      console.error(`❌ Error crítico en lote ${batchNum}:`, error);
      failedCount += batch.length;
    }
  }

  console.log(`✅ ${results.length} imágenes subidas correctamente`);
  if (failedCount > 0) {
    console.log(`⚠️  ${failedCount} imágenes fallaron`);
  }

  return { urls: results, failed: failedCount };
}