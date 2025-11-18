"use client"

import { experimental_useObject as useObject } from "@ai-sdk/react"
import { StopCircleIcon } from "lucide-react"
import { useState } from "react"
import { pokemonUISchema } from "@/app/api/structured-array/schema"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StructuredDataPage() {
  const [type, setType] = useState("")

  const { object, submit, isLoading, error, stop } = useObject({
    api: "/api/structured-array",
    schema: pokemonUISchema,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submit({ type })
    setType("")
  }
  return (
    <div>
      {error && <div className="text-red-500 mb-4 px-4">{error.message}</div>}

      <div className="space-y-8">
        {object?.map((pokemon) => (
          <div
            key={pokemon?.name}
            className="bg-zinc-50 dark:bg-zinc-800 p-6 rounded-lg shadow-sm"
          >
            <h2 className="text-2xl font-bold mb-4">{pokemon?.name}</h2>
            <div className="grid grid-cols-2 gap-4">
              {pokemon?.abilities?.map((ability) => (
                <div
                  key={ability}
                  className="bg-zinc-100 dark:bg-zinc-700 p-3 rounded-md"
                >
                  {ability}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 p-4 max-w-3xl mx-auto bg-background"
      >
        <div className="flex items-center gap-2">
          <Input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Enter a pokemon type"
            className="flex-1"
          />

          {isLoading ? (
            <Button type="button" onClick={stop}>
              <StopCircleIcon className="w-4 h-4" />
              Stop
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading || !type.trim()}>
              Generate
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}
