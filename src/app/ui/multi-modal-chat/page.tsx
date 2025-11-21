"use client"

import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { PaperclipIcon, StopCircleIcon } from "lucide-react"
import Image from "next/image"
import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function MultiModalChatPage() {
  const [input, setInput] = useState("")
  const [files, setFiles] = useState<FileList | undefined>(undefined)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const { messages, sendMessage, status, error, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/multi-modal-chat",
    }),
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage({ text: input, files })
    setInput("")
    setFiles(undefined)

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div>
      {error && <div className="text-red-500 mb-4">{error.message}</div>}

      {messages.map((message) => (
        <div key={message.id} className="mb-4">
          <div className="font-semibold">
            {message.role === "user" ? "You:" : "AI:"}
          </div>
          {message.parts.map((part, index) => {
            switch (part.type) {
              case "text":
                return (
                  <div
                    key={`${message.id}-${index}`}
                    className="whitespace-pre-wrap"
                  >
                    {part.text}
                  </div>
                )
              case "file":
                if (part.mediaType?.startsWith("image/")) {
                  return (
                    <Image
                      key={`${message.id}-${index}`}
                      src={part.url}
                      alt={part.filename ?? `attachment-${index}`}
                      width={500}
                      height={500}
                    />
                  )
                }
                if (part.mediaType?.startsWith("application/pdf")) {
                  return (
                    <iframe
                      key={`${message.id}-${index}`}
                      src={part.url}
                      width="500"
                      height="600"
                      title={part.filename ?? `attachment-${index}`}
                    />
                  )
                }
                return null
              default:
                return null
            }
          })}
        </div>
      ))}

      {(status === "submitted" || status === "streaming") && (
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400"></div>
          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 right-0 p-4 max-w-3xl mx-auto bg-background"
      >
        <div className="flex flex-col gap-3">
          <label htmlFor="file-input" className="text-sm text-gray-500">
            <PaperclipIcon className="w-4 h-4" />
            {files?.length
              ? `${files.length} file${files.length > 1 ? "s" : ""} attached`
              : "Attach files"}
            <Input
              type="file"
              multiple
              id="file-input"
              onChange={(e) => {
                if (e.target.files) {
                  setFiles(e.target.files)
                }
              }}
              className="hidden"
              ref={fileInputRef}
            />
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter your prompt"
              className="flex-1"
            />
            {status === "submitted" || status === "streaming" ? (
              <Button type="button" onClick={stop}>
                <StopCircleIcon className="w-4 h-4" />
                Stop
              </Button>
            ) : (
              <Button type="submit" disabled={status !== "ready"}>
                Send
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
