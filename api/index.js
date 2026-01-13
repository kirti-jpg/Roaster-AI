export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const search = req.query.search;

  if (!search) {
    return res.status(400).json({ roast: "Nothing to roast." });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: `User searched: "${search}". Write a witty, playful roast in 1–2 sentences.`
      })
    });

    const data = await response.json();

    // SAFELY extract text
    const roast =
      data.output_text ||
      "AI had a moment. Try again.";

    return res.status(200).json({ roast });

  } catch (error) {
    console.error("AI error:", error);
    return res.status(200).json({
      roast: "AI is tired. Even roasting needs rest."
    });
  }
}
