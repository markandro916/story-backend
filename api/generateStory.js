import fetch from "node-fetch";

export default async function handler(req, res) {
  const { characters, setting, plotOutline } = req.body;

  const prompt = `
Write a story using these details:
Characters: ${characters.map(c => `${c.name} (${c.traits.join(", ")})`).join(", ")}
Setting: ${setting}
Plot outline: ${plotOutline.join(", ")}
Write a full story in chapters.
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000
      })
    });

    const data = await response.json();
    const storyText = data.choices[0].message.content.trim();
    res.status(200).json({ storyText });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
