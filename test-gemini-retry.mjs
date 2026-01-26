import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

async function test() {
    const envPath = path.resolve(process.cwd(), '.env.local');
    if (!fs.existsSync(envPath)) {
        console.error(".env.local not found");
        return;
    }
    const content = fs.readFileSync(envPath, 'utf8');
    const match = content.match(/GEMINI_API_KEY=(.+)/);
    if (!match) {
        console.error("GEMINI_API_KEY not found in .env.local");
        return;
    }

    const apiKey = match[1].trim().replace(/^["']|["']$/g, '');

    console.log("Found API Key:", apiKey.substring(0, 5) + "..." + apiKey.slice(-5));

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        console.log("Testing with model: gemini-pro");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("Hello");
        const response = await result.response;
        console.log("SUCCESS:", response.text());
    } catch (e) {
        console.error("FAILED:", e.message);
        fs.writeFileSync('error_retry.txt', e.toString() + "\n" + JSON.stringify(e, Object.getOwnPropertyNames(e), 2));
        process.exit(1);
    }
}

test();
