import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return Response.json({ error: "Prompt is required" }, { status: 400 })
    }

    const text = await streamText({
      model: openai("gpt-4.1-nano"), // gpt-4.1-nano - fast efficient model for generating text
      prompt,
    })

    return text.toUIMessageStreamResponse()
  } catch (error) {
    console.error("Error streaming text", error)
    return new Response("Failed to stream text", { status: 500 })
  }
}
