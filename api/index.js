export default async function handler(req, res) {
  // Allow browser requests
  res.setHeader("Access-Control-Allow-Origin", "*");

  const search = req.query.search;

  if (!search) {
    return res.status(400).json({ roast: "Nothing to roast." });
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      temperature: 0.9,
      messages: [
        {
          role: "system",
          content:
            "You are a witty, playful roast generator. Be funny, not mean."
        },
        {
          role: "user",
          content:
            `User searched: "${search}". Roast them in 1–2 sentences.`
        }
      ]
    })
  });

  const data = await response.json();
  const roast = data.choices[0].message.content;

  res.status(200).json({ roast });
}
