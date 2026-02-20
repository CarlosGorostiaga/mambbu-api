import { Router } from 'express';
import multer from 'multer';
import { authenticate } from '../middleware/auth.js';
import * as adminController from '../controllers/admin.controller.js';

const router = Router();

// Configurar multer para memoria
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB por archivo
    files: 40, // Máximo 40 archivos
  }
});

// Auth
router.post('/login', adminController.login);

// Properties (protegidas con authenticate)
router.post('/properties', authenticate, adminController.createProperty);
router.post('/properties/:propertyId/images', authenticate, upload.array('images', 40), adminController.uploadPropertyImages); // ← 40 máximo
router.put('/properties/:propertyId/images/reorder', authenticate, adminController.reorderPropertyImages);
router.put('/properties/:id', authenticate, adminController.updateProperty);
router.delete('/properties/:id', authenticate, adminController.deleteProperty);

export default router;