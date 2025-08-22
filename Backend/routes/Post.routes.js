import express from 'express';
import {
  createPrompt,
  getPrompt,
  deletePrompt,
  sharePrompt,
  getSharedPrompt,
  updatePrompt,
  togglePublic,
  toggleFavorite
} from '../controller/Post.controller.js';
import ProtectRoutes  from '../middleware/Auth.middleware.js';

const router = express.Router();

// Protected routes (require authentication)
router.route('/')
  .post(ProtectRoutes, createPrompt)  // Create new prompt
  .get(ProtectRoutes, getPrompt);     // Get user's prompts

router.route('/:id')
  .delete(ProtectRoutes, deletePrompt); // Delete prompt
router.put('/:id', ProtectRoutes, updatePrompt);
router.patch('/:id/toggle-public', ProtectRoutes, togglePublic);

router.route('/:id/share')
  .post(ProtectRoutes, sharePrompt);   // Generate share link
// Route to toggle the favorite status of a specific prompt by ID
router.patch('/:id/toggle-favorite', ProtectRoutes, toggleFavorite);

// Public route (no authentication needed)
router.route('/shared/:token')
  .get(getSharedPrompt);        // Access shared prompt


export default router;


