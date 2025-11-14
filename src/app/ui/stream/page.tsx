"use client"

import { useCompletion } from "@ai-sdk/react"
import { StopCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function CompletionStreamPage() {
  const {
    input,
    handleInputChange,
    handleSubmit,
    completion,
    isLoading,
    error,
    setInput,
    stop,
  } = useCompletion({
    api: "/api/stream",
  })

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error.message}</div>}
      {isLoading && !completion && <div>Loading...</div>}
      {completion && (
        <div className="whitespace-pre-wrap max-w-3xl mx-auto">
          {completion}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault()
          setInput("")
          handleSubmit(e)
        }}
        className="fixed bottom-0 left-0 right-0 p-4 max-w-3xl mx-auto bg-background"
      >
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={input}
            onChange={handleInputChange}
            placeholder="Enter your prompt"
            className="flex-1"
          />
          {isLoading ? (
            <Button type="button" onClick={stop}>
              <StopCircleIcon className="w-4 h-4" />
              Stop
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              Generate
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
