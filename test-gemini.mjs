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
    const genAI = new GoogleGenerativeAI(apiKey);

    const modelsToTry = ["gemini-1.5-flash", "gemini-1.5-flash-001", "gemini-pro", "gemini-1.0-pro"];

    for (const modelName of modelsToTry) {
        console.log(`\nTesting model: ${modelName}`);
        try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent("Hello");
            const response = await result.response;
            console.log(`SUCCESS with ${modelName}:`, response.text());
            console.log("-----------------------------------");
            console.log("FINAL SUCCESS: At least one model works.");
            process.exit(0);
        } catch (e) {
            console.error(`FAILED with ${modelName}:`, e.message);
            if (e.message.includes("404")) {
                console.log("Model not found, trying next...");
            } else {
                const errorDetails = e.toString() + "\n" + JSON.stringify(e, Object.getOwnPropertyNames(e), 2);
                fs.writeFileSync(`error_${modelName}.txt`, errorDetails);
            }
        }
    }

    console.error("ALL MODELS FAILED");
    fs.writeFileSync('error_all_failed.txt', "All models failed");
    process.exit(1);
}

test();
