import Export from "../models/Export.model.js";
import Prompt from "../models/Post.model.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";

// Helper function to generate file
const generateFile = async (prompt, format) => {
  const fileId = uuidv4();
  const exportDir = path.join("exports");
  if (!fs.existsSync(exportDir)) fs.mkdirSync(exportDir);

  let filePath;
  let content;

  if (format === "JSON") {
    filePath = path.join(exportDir, `${fileId}.json`);
    content = JSON.stringify(prompt, null, 2);
  } else if (format === "Notion") {
    filePath = path.join(exportDir, `${fileId}.md`);
    content = `# ${prompt.title}\n\n${prompt.content}\n\n*Tags:* ${prompt.tags?.join(", ")}`;
  } else if (format === "PDF") {
    filePath = path.join(exportDir, `${fileId}.txt`); 
    // (For simplicity using txt, you can later integrate pdf-lib or puppeteer)
    content = `Prompt: ${prompt.title}\n\n${prompt.content}`;
  }

  fs.writeFileSync(filePath, content, "utf-8");
  return filePath;
};

// Create new export job
export const createExportJob = async (req, res) => {
  try {
    const { promptId, format } = req.body;

    // Validate format
    if (!['JSON', 'Notion', 'PDF'].includes(format)) {
      return res.status(400).json({ success: false, message: "Invalid export format" });
    }

    const prompt = await Prompt.findById(promptId);
    if (!prompt) {
      return res.status(404).json({ success: false, message: "Prompt not found" });
    }

    // Create export job
    const newJob = await Export.create({
      prompt: promptId,
      format,
      status: "processing"
    });

    // Generate file
    const filePath = await generateFile(prompt, format);

    newJob.status = "completed";
    newJob.downloadLink = `/exports/${path.basename(filePath)}`;
    await newJob.save();

    res.status(201).json({
      success: true,
      message: "Export job completed",
      job: newJob
    });
  } catch (error) {
    console.error("Error creating export job:", error.stack);
    res.status(500).json({
      success: false,
      message: "Server error while creating export job",
      error: error.message
    });
  }
};


// Get export job by ID
export const getExportJob = async (req, res) => {
  try {
    const job = await Export.findById(req.params.id).populate("prompt");
    if (!job) {
      return res.status(404).json({ success: false, message: "Export job not found" });
    }

    res.status(200).json({ success: true, job });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching export job",
      error: error.message
    });
  }
};
