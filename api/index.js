const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const allowedOrigins = ["https://mychatbot-frontend.vercel.app", "https://alessandrolorenz.vercel.app","*"];
app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization", "X-Figma-Token"]
    })
);

app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
       try {
        const chatHistory = req.body.history || [];
        const url = req.body.url || "";
        const file_id = req.body.file_id || "";
        const node_id = req.body.node_id || "";
        console.log("Chat History:", chatHistory);
        console.log("URL:", url);
        console.log("File ID:", file_id);
        const response = await fetch(`https://api.figma.com/v1/files/${file_id}?ids=${node_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "X-Figma-Token": `${process.env.X_FIGMA_TOKEN}`
            },

            timeout: 30000
        });

        console.log("Response from Figma API:", response.status, response);
        const botResponse = await response.json();
        
        if (!botResponse) {
            return res.status(500).json({ error: "Erro ao obter resposta do chatbot." });
        }

        res.json({ reply: botResponse });

    } catch (error) {
        console.error("Erro ao chamar a API do chatbot:", error);
        res.status(500).json({ error: "Erro no servidor." });
    }
});

// app.listen(3000, () => console.log("Chatbot rodando na porta 3000"));

module.exports = app;