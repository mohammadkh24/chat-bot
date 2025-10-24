import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fetch from "node-fetch"; // اگر Node < 18، باید نصب شود

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const LIARA_BASE_URL = process.env.LIARA_BASE_URL; // https://ai.liara.ir/api/v1/...
const LIARA_API_KEY = process.env.API_KEY;   // توکن Liara

app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;
const response = await fetch(`${LIARA_BASE_URL}/chat/completions`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${LIARA_API_KEY}`
  },
  body: JSON.stringify({
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "تو اسم تو هوشیار هست و سازندت محمد خطایی هست. همیشه پاسخ‌هات دوستانه و کوتاه باشه."
      },
      {
        role: "user",
        content: userMessage
      }
    ]
  }),
});


    const data = await response.json();

    // Liara معمولا پاسخ اصلی در data.choices[0].message.content هست
    const reply = data.choices?.[0]?.message?.content || "پاسخی دریافت نشد!";
    res.json({ reply });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
