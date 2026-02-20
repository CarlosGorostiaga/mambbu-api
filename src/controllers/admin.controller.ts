import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';
import { generateToken } from '../middleware/auth.js';
import { uploadMultipleImages } from '../services/upload.service.js';
import type { LoginRequest, CreatePropertyRequest } from '../types/auth.js';

// Login admin
export async function login(req: Request<{}, {}, LoginRequest>, res: Response) {
  try {
    const { email, password } = req.body;

    // Por ahora, usuario hardcoded (después lo movemos a BD)
    const ADMIN_EMAIL = 'admin@mambbu.com';
    const ADMIN_PASSWORD_HASH = await bcrypt.hash('admin123', 10); // Cambiar en producción

    if (email !== ADMIN_EMAIL) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = generateToken('admin-user-id');

    res.json({
      success: true,
      token,
      user: { email: ADMIN_EMAIL, role: 'admin' },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Crear propiedad
export async function createProperty(req: Request<{}, {}, CreatePropertyRequest>, res: Response) {
  try {
    const data = req.body;

    // Generar slug
    const slug = data.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // Crear propiedad sin imágenes primero
    const property = await prisma.property.create({
      data: {
        slug,
        title: data.title,
        description: data.description,
        price: data.price,
        priceValue: data.priceValue,
        location: data.location,
        locationDistrict: data.locationDistrict,
        type: data.type,
        bedrooms: data.bedrooms,
        bathrooms: data.bathrooms,
        area: data.area,
        yearBuilt: data.yearBuilt,
        amenities: data.amenities,
        images: [],
        agentId: data.agentId,
      },
    });

    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Create property error:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
}

// Subir imágenes a una propiedad
export async function uploadPropertyImages(req: Request, res: Response) {
  try {
    const { propertyId } = req.params;
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Subir a Cloudflare R2
    const imageUrls = await uploadMultipleImages(files);

    // Obtener imágenes existentes de la propiedad
    const property = await prisma.property.findUnique({
      where: { id: propertyId },
      select: { images: true },
    });

    const existingImages = (property?.images as any[]) || [];
    const startOrder = existingImages.length;

    // Crear objetos de imagen con order e isPrimary
    const newImages = imageUrls.map((url, index) => ({
      url,
      alt: `${req.body.title || 'Propiedad'} - Imagen ${startOrder + index + 1}`,
      order: startOrder + index,
      isPrimary: startOrder === 0 && index === 0, // Primera imagen es principal por defecto
    }));

    // Combinar con imágenes existentes
    const allImages = [...existingImages, ...newImages];

    // Actualizar propiedad con las imágenes
    const updatedProperty = await prisma.property.update({
      where: { id: propertyId },
      data: { images: allImages },
    });

    res.json({ success: true, data: updatedProperty });
  } catch (error) {
    console.error('Upload images error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
}

// Actualizar propiedad
export async function updateProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const data = req.body;

    const property = await prisma.property.update({
      where: { id },
      data,
    });

    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Update property error:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
}

// Eliminar propiedad
export async function deleteProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;

    await prisma.property.delete({
      where: { id },
    });

    res.json({ success: true, message: 'Property deleted' });
  } catch (error) {
    console.error('Delete property error:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
}


// Reordenar imágenes de una propiedad
export async function reorderPropertyImages(req: Request, res: Response) {
  try {
    const { propertyId } = req.params;
    const { imageOrders } = req.body; // Array de { url, order, isPrimary }

    if (!Array.isArray(imageOrders)) {
      return res.status(400).json({ error: 'Invalid image orders format' });
    }

    // Validar que solo una imagen sea isPrimary
    const primaryCount = imageOrders.filter((img) => img.isPrimary).length;
    if (primaryCount !== 1) {
      return res.status(400).json({ error: 'Exactly one image must be marked as primary' });
    }

    // Actualizar propiedad
    const property = await prisma.property.update({
      where: { id: propertyId },
      data: { images: imageOrders },
    });

    res.json({ success: true, data: property });
  } catch (error) {
    console.error('Reorder images error:', error);
    res.status(500).json({ error: 'Failed to reorder images' });
  }
}