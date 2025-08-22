import PostModel from "../models/Post.model.js";
import { v4 as uuidv4 } from 'uuid';
import expressAsyncHandler from "express-async-handler";
import { generateAITags } from "../services/Ai.service.js";
import ShareToken from "../models/ShareToken.js";
//working propering
export const createPrompt = expressAsyncHandler(async (req, res) => {
  try {
    const { title, content, format, vaultType, category } = req.body;
    const tags = await generateAITags(content);

    const newPrompt = await PostModel.create({
      title,
      content,
      format,
      tags,
      category,
      vaultType: vaultType || "personal",
      creator: req.user.id // now always exists
    });

    res.status(201).json({ success: true, data: newPrompt });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error while creating prompt",
      error: error.message
    });
  }
});

//work propper
export const getPrompt = expressAsyncHandler(async (req, res) => {
  try {
    const { vaultType, tags, search } = req.query;
    const filter = { creator: req.user.id };
    if (vaultType === 'community') {
      filter.vaultType = 'community';
      delete filter.creator;
    }
    if (tags) filter.tags = { $in: tags.split(',') };
    if (search) filter.title = { $regex: search, $options: 'i' };
    const prompts = await PostModel.find(filter).sort('-createdAt'); // Changed to PostModel
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});
//work proper 
export const deletePrompt = expressAsyncHandler(async (req, res) => {
  try {
    const prompt = await PostModel.findOne({
      _id: req.params.id,
      creator: req.user.id,
    });
    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }
    await PostModel.deleteOne({ _id: req.params.id });
    res.json({ message: "Prompt deleted permanently" }); // Improved message
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

export const sharePrompt = expressAsyncHandler(async (req, res) => {
  try {
    const { permission = 'view', expiresInDays } = req.body;
    const token = uuidv4();
    const expiresAt = expiresInDays ? 
      new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000) : 
      null;

    await ShareToken.create({
      token,
      prompt: req.params.id,
      createdBy: req.user.id,
      expiresAt,
      permission
    });

    res.json({
      success: true,
      shareUrl: `${process.env.FRONTEND_URL}/shared/${token}`,
      expiresAt: expiresAt?.toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Failed to create share link' 
    });
  }
});

export const getSharedPrompt = expressAsyncHandler(async (req, res) => {
  try {
    const token = await ShareToken.findOne({
      token: req.params.token,
      expiresAt: { $gt: new Date() } // Not expired
    }).populate('prompt');
    
    if (!token) {
      return res.status(404).json({ error: 'Invalid or expired link' });
    }
    
    res.json({
      prompt: token.prompt,
      permission: token.permission
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

export const updatePrompt = expressAsyncHandler(async (req, res) => {
  try {
    const { title, content, format, vaultType, category } = req.body;
    const prompt = await PostModel.findOne({
      _id: req.params.id,
      creator: req.user.id
    });

    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    // Optional: regenerate tags if content changes
    if (content && content !== prompt.content) {
      prompt.tags = await generateAITags(content);
    }

    prompt.title = title || prompt.title;
    prompt.content = content || prompt.content;
    prompt.format = format || prompt.format;
    prompt.vaultType = vaultType || prompt.vaultType;
    prompt.category = category || prompt.category;

    await prompt.save();
    res.json({ success: true, data: prompt });
  } catch (error) {
    res.status(500).json({ error: "Server error while updating prompt" });
  }
});
export const togglePublic = expressAsyncHandler(async (req, res) => {
  try {
    const prompt = await PostModel.findOne({
      _id: req.params.id,
      creator: req.user.id
    });

    if (!prompt) {
      return res.status(404).json({ error: "Prompt not found" });
    }

    prompt.isPublic = !prompt.isPublic;
    await prompt.save();

    res.json({ success: true, message: `Prompt is now ${prompt.isPublic ? "public" : "private"}`, data: prompt });
  } catch (error) {
    res.status(500).json({ error: "Server error while toggling prompt visibility" });
  }
});
export const toggleFavorite = expressAsyncHandler(async (req, res) => {
  try {
    const prompt = await PostModel.findById(req.params.id);
    if (!prompt) return res.status(404).json({ error: "Prompt not found" });

    const user = req.user;
    const isFav = user.favorites.includes(prompt._id);

    if (isFav) {
      user.favorites.pull(prompt._id);
    } else {
      user.favorites.push(prompt._id);
    }
    await user.save();

    res.json({ success: true, message: isFav ? "Removed from favorites" : "Added to favorites" });
  } catch (error) {
    res.status(500).json({ error: "Server error while toggling favorite" });
  }
});

