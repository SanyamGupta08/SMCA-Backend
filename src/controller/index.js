const fs = require("fs");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const {
  GEMINI_API_KEY,
  GOOGLE_VISION_API_KEY,
} = require("../config/server-config");

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

function fileToBase64(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  return fileBuffer.toString("base64");
}

// --- Helper: Clean Gemini JSON ---
function safeJsonParse(text) {
  if (!text) throw new Error("Empty response from Gemini");

  // Remove Markdown fences if present
  text = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("Gemini returned invalid JSON, raw output:\n", text);
    throw err;
  }
}

// Helper to ask Gemini and force JSON output
async function analyzeWithGemini(prompt, extraInput = null) {
  const input = [
    {
      text: `
You are a content safety and description generator.
Return JSON only with fields:
{
  "internet": "safe or unsafe with reason",
  "description": "short description",
  "summary": "short summary",
  "hashtags": ["tag1","tag2","tag3"],
  "suggestions": ["suggestion1","suggestion2"]
}

Analyze:
${prompt}
      `,
    },
  ];

  if (extraInput) input.push(extraInput);

  const result = await model.generateContent(input);
  const rawText = result.response.text();
  return safeJsonParse(rawText);
}

const analyzePdf = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No PDF uploaded" });

    const pdfBuffer = fs.readFileSync(file.path);
    const data = await pdfParse(pdfBuffer);

    const geminiResp = await analyzeWithGemini(data.text);

    fs.unlinkSync(file.path);

    return res.json({
      extractedText: data.text,
      ...geminiResp,
    });
  } catch (err) {
    console.error("PDF Analysis Error:", err);
    res.status(500).json({ error: err.message });
  }
};

const analyzeImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No image uploaded" });

    const base64Image = fileToBase64(file.path);

    // OCR via Google Vision
    const visionRes = await fetch(
      `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requests: [
            {
              image: { content: base64Image },
              features: [{ type: "TEXT_DETECTION" }],
            },
          ],
        }),
      }
    );

    const visionJson = await visionRes.json();
    const ocrText =
      visionJson.responses?.[0]?.fullTextAnnotation?.text ||
      visionJson.responses?.[0]?.textAnnotations?.[0]?.description ||
      "No text found";

    const geminiResp = await analyzeWithGemini(ocrText, {
      inlineData: {
        mimeType: file.mimetype,
        data: base64Image,
      },
    });

    fs.unlinkSync(file.path);

    return res.json({
      extractedText: ocrText,
      ...geminiResp,
    });
  } catch (err) {
    console.error("Image Analysis Error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = { analyzeImage, analyzePdf };
