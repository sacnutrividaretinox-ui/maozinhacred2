import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());
app.use(cors());

// === CONFIG ===
const TOKEN = "687eeeae24e56030ffe2aeef838d1f0e";
const PORT = process.env.PORT || 3000;

// === Caminhos ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// === Servir Front ===
app.use(express.static(__dirname));
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "index.html")));

// === Rota principal ===
app.post("/api/checkout", async (req, res) => {
  const { cpf, valor, parcelas } = req.body;
  console.log("📩 Requisição recebida:", { cpf, valor, parcelas });

  if (!cpf || !valor) {
    return res.status(400).json({ error: "Descrição e valor são obrigatórios." });
  }

  try {
    const url = `https://apela-api.tech/?user=${TOKEN}&cpf=${cpf}&valor=${valor}&parcelas=${parcelas || 1}`;
    console.log("🔗 Chamando API externa:", url);

    const response = await fetch(url);
    const text = await response.text();

    console.log("📨 Resposta bruta da API:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.warn("⚠️ Resposta não veio em JSON, usando mock de fallback.");
      data = { status: "mock", mensagem: "API externa não respondeu em JSON." };
    }

    if (response.status !== 200) {
      console.warn("⚠️ API retornou erro:", response.status, data);
      return res.status(response.status).json({
        error: data.error || "Erro retornado pela API externa",
        detalhes: data
      });
    }

    res.json({
      status: data.status || "Aprovado",
      mensagem: data.mensagem || "Análise concluída com sucesso",
      parcelas,
      valor,
      retorno: data
    });
  } catch (error) {
    console.error("❌ Falha ao consultar API:", error.message);
    res.status(500).json({
      error: "Falha ao consultar API externa",
      mock: {
        status: "Aprovado",
        mensagem: "API fora do ar, resposta simulada",
        parcelas,
        valor
      }
    });
  }
});

// === Inicialização ===
app.listen(PORT, () => {
  console.log("===================================");
  console.log("🔥 Servidor Mãozinha Cred rodando!");
  console.log(`🚀 Porta: ${PORT}`);
  console.log("===================================");
});
