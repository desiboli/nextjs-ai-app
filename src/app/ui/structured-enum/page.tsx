"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StructuredEnumPage() {
  const [text, setText] = useState("")
  const [sentiment, setSentiment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyzeSentiment = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsLoading(true)
    setError(null)
    setText("")

    try {
      const response = await fetch("/api/structured-enum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong")
      }

      setSentiment(data)
    } catch (error) {
      console.error("Error:", error)
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {isLoading ? (
        <div className="text-center">Analyzing sentiment...</div>
      ) : sentiment ? (
        <div className="text-center">
          <div className="text-3xl font-bold">
            {sentiment === "positive" && "😊 Positive"}
            {sentiment === "negative" && "😞 Negative"}
            {sentiment === "neutral" && "😐 Neutral"}
          </div>
        </div>
      ) : null}

      <form
        onSubmit={analyzeSentiment}
        className="fixed bottom-0 left-0 right-0 p-4 max-w-3xl mx-auto bg-background"
      >
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to analyze..."
            className="flex-1"
          />

          <Button type="submit" disabled={isLoading || !text.trim()}>
            Analyze
          </Button>
        </div>
      </form>
    </div>
  )
}
