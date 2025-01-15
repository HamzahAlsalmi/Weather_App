import path from "node:path";
import { fileURLToPath } from "node:url";
import { Router } from "express";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const router = Router();

// TODO: Define route to serve index.html
router.get("*", (req, res) => {
  try {
    // TODO: Set the path to the index.html file
    const indexPath = path.join(__dirname, "../../public/index.html");

    // TODO: Serve the index.html file
    res.sendFile(indexPath);
  } catch (error) {
    // TODO: Handle errors in case the file cannot be served
    console.error("Error serving index.html:", error);
    res.status(500).json({ error: "Internal server error." });
  }
});

export default router;
