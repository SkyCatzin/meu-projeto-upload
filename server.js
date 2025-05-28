const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 3000;

// Cria pasta uploads se não existir
const uploadFolder = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder);
}

// Configuração do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadFolder),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Servir arquivos estáticos da pasta "public"
app.use(express.static(path.join(__dirname, "public")));

// Servir os arquivos da pasta uploads para download
app.use("/uploads", express.static(uploadFolder));

// Endpoint de upload
app.post("/upload", upload.single("arquivo"), (req, res) => {
  res.send("Arquivo enviado com sucesso!");
});

// Endpoint para listar arquivos
app.get("/arquivos", (req, res) => {
  fs.readdir(uploadFolder, (err, files) => {
    if (err) {
      return res.status(500).send("Erro ao listar arquivos.");
    }
    res.json(files);
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
