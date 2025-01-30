const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/chat", async (req, res) => {
    const chatHistory = req.body.history || [];


    if (!userMessage || userMessage.trim() === "") {
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
            })
        });

        const botResponse = await response.json();
        
        if (!botResponse || !botResponse.text) {
            return res.status(500).json({ error: "Erro ao obter resposta do chatbot." });
        }

        res.json({ reply: botResponse.text });

    } catch (error) {
        res.status(500).json({ error: "Erro no servidor." });
    }
});

// app.listen(3000, () => console.log("Chatbot rodando na porta 3000"));

module.exports = app;