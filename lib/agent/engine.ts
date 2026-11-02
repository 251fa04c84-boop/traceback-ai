async function queryGeminiLive(prompt: string, apiKey: string) {
  const candidateModels = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-2.0-flash"];
  let lastError: Error | null = null;

  for (const model of candidateModels) {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json", temperature: 0.1 }
        })
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Model ${model} Error ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) throw new Error(`Model ${model} returned empty response`);
      return JSON.parse(text);
    } catch (err: any) {
      lastError = err;
    }
  }
  throw lastError || new Error("All Gemini model endpoints failed");
}
