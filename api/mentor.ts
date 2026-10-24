import { GoogleGenAI } from '@google/genai';

// Same (req, res) shape for Vercel Node functions and Express, so server.ts reuses this handler locally.
type Req = { method?: string; body?: { prompt?: string; context?: string; userCode?: string } };
type Res = { status(code: number): { json(body: unknown): unknown } };

// AI Mentor Endpoint (Gemini)
export default async function handler(req: Req, res: Res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { prompt, context, userCode } = req.body ?? {};
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      return res.status(200).json({
        reply: `🤖 **Loo, ton mentor Skilloo (mode local)** : Vous posez une question sur "${prompt || 'la leçon'}".
Pour obtenir des explications sur-mesure de l'IA Gemini, veuillez configurer la variable d'environnement \`GEMINI_API_KEY\`.

En attendant, voici un conseil clé : vérifiez les types Solidity (uint256, address) et assurez-vous de bien respecter la logique des événements et la sécurité des fonctions !`,
        isFallback: true
      });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemPrompt = `Tu es Loo, le Mentor IA expert en Blockchain, Web3 et Développement Numérique de Skilloo City.
Tu t'adresses à un apprenant francophone (contexte Afrique francophone & mondial).
Ton ton est pédagogique, encourageant, moderne et orienté résolution de problèmes pratiques.
Réponds de manière claire, concise, avec du formatage Markdown si approprié.
Ne donne pas la réponse directe des quiz, mais explique la logique et guide la réflexion.

Contexte actuel de l'apprenant : ${context || 'Parcours Blockchain & Smart Contracts'}
Code écrit par l'apprenant : ${userCode ? '```solidity\n' + userCode + '\n```' : 'Aucun code fourni'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nQuestion de l'apprenant : ${prompt}` }] }
      ]
    });

    const replyText = response.text || "Désolé, je n'ai pas pu générer de réponse pour le moment.";
    return res.status(200).json({ reply: replyText, isFallback: false });
  } catch (err: unknown) {
    console.error('Gemini API Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue';
    return res.status(500).json({
      error: 'Erreur lors de la communication avec le mentor IA.',
      details: errorMessage
    });
  }
}
