import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { stats, topProducts, lowStock } = await req.json();

    // 1. Check API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key manquante" }, { status: 500 });
    }

    // 2. Initialize Model
    const genAI = new GoogleGenerativeAI(apiKey);

    // 3. Use the working model detected via script
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      Tu es un expert en gestion de stock.
      Données:
      - CA: ${stats.totalSalesValue} €
      - Ventes: ${stats.productsSold}
      - Stock: ${stats.totalStockValue} €
      
      Top produits: ${JSON.stringify(topProducts)}
      Stock faible: ${JSON.stringify(lowStock)}

      Analyse la performance en 2 phrases très courtes et directes. 
      Va droit au but. Pas de bla-bla.
      Termine par 1 action précise et concrète pour améliorer les ventes.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });

  } catch (error) {
    console.error("Erreur IA:", error);
    return NextResponse.json(
      { error: error.message || "Erreur de génération" },
      { status: 500 }
    );
  }
}