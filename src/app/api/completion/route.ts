import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: openai("gpt-4.1-nano"), // gpt-4.1-nano - fast efficient model for generating text
      prompt,
    })

    return Response.json({ text })
  } catch (error) {
    console.error("Error generating text", error)
    return Response.json({ error: "Failed to generate text" }, { status: 500 })
  }
}
