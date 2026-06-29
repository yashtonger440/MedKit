import express from "express";
import Groq from "groq-sdk";

const router = express.Router();
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1000,
      messages: [
        {
          role: "system",
          content: `You are MedKit AI Assistant — a helpful healthcare chatbot for MedKit, a home healthcare platform in Dehradun, India.

About MedKit:
- Home healthcare services: Injection at Home, IV Drip, ECG, Physiotherapy, BP & Sugar Check, Blood Test, Nurse Visit, Dressing, Plaster
- Doctor consultations: Audio Call, Video Call, Home Visit
- Service available in Dehradun and nearby areas
- Pay after service — no upfront payment
- Technicians visit home within scheduled time

You can help with:
1. MedKit services, pricing, and booking guidance
2. General health questions
3. Suggest which service user might need

Keep responses concise. Reply in same language as user (Hindi or English).
For emergencies always say: Call 112 or visit nearest hospital immediately.`,
        },
        ...messages,
      ],
    });

    res.json({ reply: response.choices[0].message.content });
  } catch (err) {
    console.error("Chatbot error:", err);
    res.status(500).json({ message: "AI service error" });
  }
});

export default router;