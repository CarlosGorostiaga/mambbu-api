import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import * as adminController from '../controllers/admin.controller.js';

const router = Router();

// Configurar multer para memoria (no disco)
const upload = multer({ storage: multer.memoryStorage() });

// Auth
router.post('/login', adminController.login);

// Properties (protegidas con authenticate)
router.post('/properties', authenticate, adminController.createProperty);
router.post('/properties/:propertyId/images', authenticate, upload.array('images', 10), adminController.uploadPropertyImages);
router.put('/properties/:propertyId/images/reorder', authenticate, adminController.reorderPropertyImages); // ← NUEVA
router.put('/properties/:id', authenticate, adminController.updateProperty);
router.delete('/properties/:id', authenticate, adminController.deleteProperty);

export default router;