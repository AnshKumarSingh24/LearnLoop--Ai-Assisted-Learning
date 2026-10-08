import { invokeLLM } from "../_core/llm";

export interface AICompletionOptions {
  systemPrompt?: string;
  userPrompt: string;
  temperature?: number;
  provider?: "groq" | "gemini" | "auto";
}

export async function generateAICompletion(options: AICompletionOptions): Promise<string> {
  const { systemPrompt = "You are an intelligent study assistant for LearnLoop.", userPrompt, provider = "auto" } = options;

  const geminiKey = process.env.GEMINI_API_KEY;
  const groqKey = process.env.GROQ_API_KEY;

  // Try Groq API if requested or available
  if ((provider === "groq" || (provider === "auto" && groqKey)) && groqKey) {
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${groqKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
          ],
          temperature: options.temperature ?? 0.7,
        })
      });
      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return content;
      }
    } catch (e) {
      console.warn("Groq API call failed, falling back:", e);
    }
  }

  // Try Gemini API if requested or available
  if ((provider === "gemini" || (provider === "auto" && geminiKey)) && geminiKey) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
            }
          ]
        })
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (e) {
      console.warn("Gemini API call failed, falling back:", e);
    }
  }

  // Fall back to built-in invokeLLM or mock response if keys are not present/fail
  try {
    const result = await invokeLLM({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ]
    });
    const output = result.choices?.[0]?.message?.content;
    if (typeof output === "string") return output;
  } catch (e) {
    console.warn("invokeLLM failed:", e);
  }

  // Fallback response if no LLM provider is active
  return `[LearnLoop AI Response] Here is a synthesized overview based on your request:\n\n1. **Core Concept**: ${userPrompt.slice(0, 100)}...\n2. **Key Insight**: Study systematically by breaking topics into active recall modules.\n3. **Recommendation**: Review associated library files and notes to reinforce mastery.`;
}
