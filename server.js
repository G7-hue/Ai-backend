const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

app.post("/api/ask", async (req, res) => {
    const { question } = req.body;

    if (!question) {
        return res.status(400).json({ error: "Question is required" });
    }

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENAI_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: question }]
            })
        });

        const data = await response.json();
        res.json({ answer: data.choices[0].message.content });
    } catch (error) {
        res.status(500).json({ error: "Error fetching response from OpenAI" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
