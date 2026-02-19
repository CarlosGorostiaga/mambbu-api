import { Request, Response } from 'express';
import prisma from '../lib/prisma.js';

export async function getProperties(req: Request, res: Response) {
  try {
    const properties = await prisma.property.findMany({
      include: {
        agent: {
          include: {
            agency: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json({
      success: true,
      count: properties.length,
      data: properties
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