import express from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new OpenAI({
  baseURL: "https://router.huggingface.co/v1",
  apiKey: process.env.HF_TOKEN,
});

// مسیر چت
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const chatCompletion = await client.chat.completions.create({
      model: "CohereLabs/aya-expanse-8b:cohere", // مدل چت دلخواه
      messages: [
        {
          role: "user",
          content: userMessage,
        },
      ],
    });

    res.json({
      reply: chatCompletion.choices[0].message,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

// شروع سرور
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
