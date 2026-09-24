const { GoogleGenerativeAI } = require("@google/generative-ai");
const { taoDanYTuText, taoDanYTuFile } = require("./prompts/prompts");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function parseKetQua(rawText) {
  const cleaned = rawText.replace(/```json|```/g, "").trim();
  return JSON.parse(cleaned);
}

async function xuLyTuText(text) {
  const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
  const prompt = `${taoDanYTuText}\n\nNội dung cần xử lý:\n${text}`;
  const result = await model.generateContent(prompt);
  return parseKetQua(result.response.text());
}

async function xuLyTuFile(fileUrl, fileType) {
  const response = await fetch(fileUrl);
  const arrayBuffer = await response.arrayBuffer();
  const base64Data = Buffer.from(arrayBuffer).toString("base64");

  const mimeType = fileType === "pdf" ? "application/pdf" : "image/jpeg";

  const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });
  const result = await model.generateContent([
    taoDanYTuFile,
    { inlineData: { data: base64Data, mimeType: mimeType } },
  ]);
  return parseKetQua(result.response.text());
}

module.exports = { xuLyTuText, xuLyTuFile };
