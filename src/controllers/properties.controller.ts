import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export async function getProperties(req: Request, res: Response) {
  try {
    const {
      location,
      type,
      minPrice,
      maxPrice,
      bedrooms,
      status = 'available',
      featured,
      sortBy = 'newest',
      page = '1',
      perPage = '6'
    } = req.query;

    // Construir filtros
    const where: any = {
      status: status as string
    };

    if (location) {
      where.location = location as string;
    }

    if (type) {
      where.type = type as string;
    }

    if (minPrice || maxPrice) {
      where.priceValue = {};
      if (minPrice) where.priceValue.gte = Number(minPrice);
      if (maxPrice) where.priceValue.lte = Number(maxPrice);
    }

    if (bedrooms) {
      where.bedrooms = { gte: Number(bedrooms) };
    }

    if (featured !== undefined) {
      where.featured = featured === 'true';
    }

    // Ordenamiento
    let orderBy: any = { createdAt: 'desc' };
    
    if (sortBy === 'price-asc') {
      orderBy = { priceValue: 'asc' };
    } else if (sortBy === 'price-desc') {
      orderBy = { priceValue: 'desc' };
    } else if (sortBy === 'relevance') {
      orderBy = [
        { featured: 'desc' },
        { newListing: 'desc' },
        { createdAt: 'desc' }
      ];
    }

    // Paginación
    const pageNum = Number(page);
    const perPageNum = Number(perPage);
    const skip = (pageNum - 1) * perPageNum;

    // Contar total
    const total = await prisma.property.count({ where });

    // Obtener propiedades
    const properties = await prisma.property.findMany({
      where,
      include: {
        agent: {
          include: {
            agency: true
          }
        }
      },
      orderBy,
      skip,
      take: perPageNum
    });

    // ✅ Ordenar imágenes de cada propiedad
    const sortedProperties = properties.map(property => {
      const images = property.images as any[];
      
      if (Array.isArray(images) && images.length > 0) {
        // Ordenar: isPrimary primero, luego por order
        const sortedImages = [...images].sort((a, b) => {
          if (a.isPrimary) return -1;
          if (b.isPrimary) return 1;
          return (a.order || 0) - (b.order || 0);
        });

        return { ...property, images: sortedImages };
      }

      return property;
    });

    const totalPages = Math.ceil(total / perPageNum);

    res.json({
      success: true,
      total,
      totalPages,
      currentPage: pageNum,
      perPage: perPageNum,
      data: sortedProperties // ← Usar propiedades con imágenes ordenadas
    });
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener propiedades'
    });
  }
}

export async function getPropertyBySlug(req: Request, res: Response) {
  try {
    const { slug } = req.params;

    const property = await prisma.property.findUnique({
      where: { slug },
      include: {
        agent: {
          include: {
            agency: true
          }
        }
      }
    });

    if (!property) {
      return res.status(404).json({
        success: false,
        error: 'Propiedad no encontrada'
      });
    }

    // ✅ Ordenar imágenes
    const images = property.images as any[];
    
    if (Array.isArray(images) && images.length > 0) {
      const sortedImages = [...images].sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return (a.order || 0) - (b.order || 0);
      });

      property.images = sortedImages as any;
    }

    res.json({
      success: true,
      data: property
    });
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({
      success: false,
      error: 'Error al obtener propiedad'
    });
  }
}