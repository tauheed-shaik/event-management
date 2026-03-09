/**
 * Groq AI: Generate event description using event name, date, keywords.
 */
export async function generateEventDescription({ name, date, keywords=[] }){
  const apiKey = process.env.GROQ_API_KEY;
  if(!apiKey) throw new Error("GROQ_API_KEY missing in .env");

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const prettyDate = date ? new Date(date).toDateString() : "";

  const prompt = `Write a detailed event description for a college event.
Event Name: ${name}
Event Date: ${prettyDate}
Keywords: ${keywords.join(", ") || "N/A"}
Rules:
- 150 to 220 words
- Mention agenda, who should attend, key highlights
- End with a short call-to-action (registration encouraged)
Return plain text only.`;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: "You write event descriptions for college portals." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 300
    })
  });

  const data = await response.json();
  if(!response.ok){
    const msg = data?.error?.message || "Groq API error";
    throw new Error(msg);
  }

  return data?.choices?.[0]?.message?.content?.trim() || "";
}
