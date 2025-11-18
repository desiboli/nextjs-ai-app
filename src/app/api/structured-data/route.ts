import { openai } from "@ai-sdk/openai"
import { streamObject } from "ai"
import { recipeSchema } from "./schema"

export async function POST(request: Request) {
  try {
    const { dish } = await request.json()

    const result = await streamObject({
      model: openai("gpt-4.1-nano"),
      prompt: `Generate a recipe for ${dish}`,
      schema: recipeSchema,
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error generating recipe:", error)
    return new Response("Failed to generate recipe", { status: 500 })
  }
}
