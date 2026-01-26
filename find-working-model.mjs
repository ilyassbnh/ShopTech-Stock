import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

async function findModel() {
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
    const genAI = new GoogleGenerativeAI(apiKey);

    console.log("Fetching model list...");

    try {
        // Raw fetch to get list
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.models) {
            console.error("No models returned.");
            return;
        }

        console.log(`Found ${data.models.length} models.`);

        // Filter for generateContent support
        const chatModels = data.models.filter(m =>
            m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")
        );

        console.log(`Found ${chatModels.length} chat models.`);

        for (const m of chatModels) {
            const modelName = m.name.replace("models/", ""); // SDK usually takes "gemini-..." not "models/gemini-..."
            console.log(`Testing: ${modelName}`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("test");
                const response = await result.response;
                console.log(`SUCCESS! Working model found: ${modelName}`);
                // Write to file so agent can read it guaranteed
                fs.writeFileSync('working_model.txt', modelName);
                process.exit(0);
            } catch (e) {
                console.log(`Failed: ${e.message.substring(0, 50)}...`);
            }
        }

        console.error("No working models found.");

    } catch (e) {
        console.error("Error:", e);
    }
}

findModel();
