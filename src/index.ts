import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import * as dotenv from "dotenv";
import { handleResumeUpload } from "./controllers/upload";
import { upload } from "./middleware/upload";
import { apiRateLimit } from "./middleware/security";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc:  ["'self'"],
      objectSrc:  ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

const allowedOrigin = process.env.ALLOWED_ORIGIN;
if (!allowedOrigin) {
  console.error("[FATAL] Variável ALLOWED_ORIGIN não definida. Encerrando.");
  process.exit(1);
}

app.use(cors({
  origin: allowedOrigin,
  methods: ["POST"],
  allowedHeaders: ["Content-Type"],
  credentials: false
}));

app.use(compression());
app.use(express.json({ limit: "50kb" }));

app.post(
  "/api/analisar",
  apiRateLimit,
  upload.single("resume"),
  handleResumeUpload
);

app.listen(port, () => {
  if (process.env.NODE_ENV !== "production") {
    console.log(`[dev] Servidor rodando na porta ${port}`);
  }
});
