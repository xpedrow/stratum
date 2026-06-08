import express from "express";
import cors from "cors";
import compression from "compression";
import multer from "multer";
import * as path from "path";
import * as fs from "fs";
import { handleResumeUpload } from "./controllers/upload";

const app = express();
const port = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, "../tmp");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({ dest: uploadDir });

app.use(cors());
app.use(compression());
app.use(express.json());

app.post("/api/analisar", upload.single("resume"), handleResumeUpload);

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
