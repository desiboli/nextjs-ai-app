"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CompletionPage() {
  const [prompt, setPrompt] = useState("") // user input
  const [completion, setCompletion] = useState("") // AI response
  const [isLoading, setIsLoading] = useState(false) // loading state
  const [error, setError] = useState<string | null>(null) // error state

  const complete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)
    setPrompt("")
    setCompletion("")
    setError(null)

    try {
      const response = await fetch("/api/completion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate completion")
      }

      setCompletion(data.text)
    } catch (error) {
      console.error(error)
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong, please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isLoading ? (
        <div>Loading...</div>
      ) : completion ? (
        <div className="whitespace-pre-wrap max-w-3xl mx-auto">
          {completion}
        </div>
      ) : null}

      <form
        onSubmit={complete}
        className="fixed bottom-0 left-0 right-0 p-4 max-w-3xl mx-auto bg-background"
      >
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter your prompt"
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </form>
    </div>
  )
}
