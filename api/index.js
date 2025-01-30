const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const allowedOrigins = ["https://mychatbot-frontend.vercel.app", "https://alessandrolorenz.vercel.app"];
app.use(
    cors({
        origin: allowedOrigins,
        methods: ["GET", "POST"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
    const chatHistory = req.body.history || [];
    if (chatHistory.length === 0) {
        return res.status(400).json({ error: "A mensagem não pode estar vazia." });
    }

    try {

        const response = await fetch("https://api.cohere.ai/v1/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.COHERE_API_KEY}`
            },
            body: JSON.stringify({
                model: "command",
                message: chatHistory[chatHistory.length - 1].message,
                chat_history: chatHistory.slice(0, -1)
            }),
            timeout: 30000
        });

        const botResponse = await response.json();
        
        if (!botResponse || !botResponse.text) {
            return res.status(500).json({ error: "Erro ao obter resposta do chatbot." });
        }

        res.json({ reply: botResponse.text });

    } catch (error) {
        console.error("Erro ao chamar a API do chatbot:", error);
        res.status(500).json({ error: "Erro no servidor." });
    }
});

// app.listen(3000, () => console.log("Chatbot rodando na porta 3000"));

module.exports = app;