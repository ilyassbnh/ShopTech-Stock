import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 1. Récupérer les données envoyées par le Dashboard
    const { stats, topProducts } = await req.json();

    // 2. Initialiser Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // 3. Préparer le prompt pour l'IA
    const prompt = `
      Tu es un expert en analyse de données commerciales.
      Voici les statistiques de vente de mon magasin ce mois-ci :
      - Revenu total : ${stats.totalSalesValue} €
      - Produits vendus : ${stats.productsSold}
      - Stock restant : ${stats.totalStock}
      
      Voici quelques produits phares (Top Ventes) :
      ${JSON.stringify(topProducts)}

      Agis comme un consultant business. Rédige un court paragraphe (max 3 phrases) pour analyser cette performance.
      Sois direct, professionnel et donne un conseil d'action (ex: promotion, réapprovisionnement).
      Ne dis pas "bonjour", commence directement l'analyse.
    `;

    // 4. Générer la réponse
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ analysis: text });

  } catch (error) {
    console.error("Erreur IA:", error);
    return NextResponse.json(
      { error: "Impossible de générer l'analyse pour le moment." },
      { status: 500 }
    );
  }
}