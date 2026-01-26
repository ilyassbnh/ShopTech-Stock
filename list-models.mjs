import fs from 'fs';
import path from 'path';
import { GoogleGenerativeAI } from "@google/generative-ai";

async function listModels() {
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

    // Use a customized fetch implementation if needed, but standard should work in Node 18+
    const genAI = new GoogleGenerativeAI(apiKey);

    console.log("Attempting to list models...");

    try {
        // There isn't a direct "genAI.listModels()" on the main class in some versions, 
        // it's usually on the model manager or confirmed via a model request.
        // Actually, simply trying to fetching a model *is* the standard check, 
        // but correct check is to use the API directly or check docs.
        // However, the SDK *does* allow listing models via the verify script sometimes? 
        // No, the SDK simplifies it.

        // Let's try the fallback of making a raw REST call to list models if the SDK is obscure
        // But since we are using the SDK, let's try to just use a known "safe" model like 'embedding-001' or just report the error details from the main attempt.

        // Actually, newer SDKs don't expose listModels easily on the client instance.
        // Let's try a raw fetch to the API endpoint to see what the server says.

        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            console.log("SUCCESS: API Key works. Available models:");
            if (data.models) {
                data.models.forEach(m => console.log(` - ${m.name}`));
            } else {
                console.log("No models returned (empty list).");
            }
        } else {
            console.error("FAILURE: API returned error:");
            console.error(JSON.stringify(data, null, 2));
        }

    } catch (e) {
        console.error("FAILURE: Network/Code error:", e);
    }
}

listModels();
