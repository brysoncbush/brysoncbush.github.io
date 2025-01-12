import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai"; // Use 'import' for ES Modules

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const port = 3000; // or any available port

const genAI = new GoogleGenerativeAI("AIzaSyCArurborzmNvkvbeYWKypV7GbyLQ68A00");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/generate-welcome", async (req, res) => {
  try {
    const prompt = "You are a personal assistant, ONLY give a welcome message, no saying you can help (make it randomized, and just give an immediate response)!";

    const message = await model.generateContent(prompt);

    // Log the response for debugging
    console.log("Generated message response:", message);

    if (message && message.response && message.response.text) {
      // Call the function stored in `text` to get the actual message
      const welcomeMessage = await message.response.text();
      res.json({ message: welcomeMessage });
    } else {
      throw new Error("Failed to retrieve message content from response.");
    }
  } catch (error) {
    console.error("Error generating welcome message:", error);
    res.status(500).json({ error: "Failed to generate message" });
  }
});

// Simple GET endpoint to check if the server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});