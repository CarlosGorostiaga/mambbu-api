import { Router } from 'express';
import * as PropertiesController from '../controllers/properties.controller.js';

const router = Router();

// GET /api/properties - Listar todas las propiedades
router.get('/', PropertiesController.getProperties);

// GET /api/properties/:slug - Obtener propiedad por slug
router.get('/:slug', PropertiesController.getPropertyBySlug);

export default router;