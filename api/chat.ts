import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const { messages } = req.body;

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `
Você é a Lize, uma assistente educacional brasileira.
Ajuda estudantes com cidadania, direitos, política e educação.
Sempre responda em português, com linguagem simples e amigável.
Usa emojis de forma leve.
          `
        },
        ...messages,
      ],
    });

    res.status(200).json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erro ao conectar com a IA" });
  }
}
