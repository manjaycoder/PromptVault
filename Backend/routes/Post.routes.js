import express from 'express';
import {
  createPrompt,
  getPrompt,
  deletePrompt,
  sharePrompt,
  getSharedPrompt
} from '../controller/Post.controller.js';
import ProtectRoutes  from '../middleware/Auth.middleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.route('/')
  .post(ProtectRoutes, createPrompt)  // Create new prompt
  .get(ProtectRoutes, getPrompt);     // Get user's prompts

router.route('/:id')
  .delete(ProtectRoutes, deletePrompt); // Delete prompt

router.route('/:id/share')
  .post(ProtectRoutes, sharePrompt);   // Generate share link

// Public route (no authentication needed)
router.route('/shared/:token')
  .get(getSharedPrompt);        // Access shared prompt


export default router;
