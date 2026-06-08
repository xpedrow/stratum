import multer, { FileFilterCallback } from "multer";
import { Request } from "express";
import * as fs from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = path.join(__dirname, "../../tmp");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, _file, cb) => {
    cb(null, `${randomUUID()}.pdf`);
  }
});

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype !== "application/pdf") {
    return cb(new Error("Apenas arquivos PDF são permitidos"));
  }
  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
