"use client"

import { useState, FormEvent } from "react"
import { Send, Bot, Paperclip, Mic, CornerDownLeft } from "lucide-react"
import { Button } from "./ui/button"
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "./ui/chat-bubble"
import { ChatInput } from "./ui/chat-input"
import {
  ExpandableChat,
  ExpandableChatHeader,
  ExpandableChatBody,
  ExpandableChatFooter,
} from "./ui/expandable-chat"
import { ChatMessageList } from "./ui/chat-message-list"
import mascotIcon from 'figma:asset/202083b6ed83af38db2a8abb9c97b03fe3f569c7.png';
import chatIcon from 'figma:asset/326f260239805f33c7580f677fb3589bb5334b10.png';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function ExpandableChatDemo() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Olá! Sou a Lize, sua assistente de aprendizado! Como posso ajudar você hoje? 🦜",
      sender: "ai",
    },
  ])

  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault()
  if (!input.trim()) return

  const userMessage = {
    role: "user",
    content: input,
  }

  setMessages((prev) => [
    ...prev,
    {
      id: prev.length + 1,
      content: input,
      sender: "user",
    },
  ])

  setInput("")
  setIsLoading(true)

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          ...messages.map((msg) => ({
            role: msg.sender === "user" ? "user" : "assistant",
            content: msg.content,
          })),
          userMessage,
        ],
      }),
    })

    const data = await response.json()

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        content: data.reply,
        sender: "ai",
      },
    ])

  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        content: "Tive um problema pra responder agora 🥲 tenta de novo!",
        sender: "ai",
      },
    ])
  } finally {
    setIsLoading(false)
  }
}


  const handleAttachFile = () => {
    // Funcionalidade de anexar arquivo
  }

  const handleMicrophoneClick = () => {
    // Funcionalidade de microfone
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as any)
    }
  }

  return (
    <ExpandableChat
      size="lg"
      position="bottom-right"
      icon={<ImageWithFallback src={chatIcon} alt="Chat com Lize" className="h-10 w-10 object-contain" />}
      className="[&>button]:bg-gray-900 [&>button]:shadow-2xl [&>button]:hover:bg-gray-800 [&>button]:w-20 [&>button]:h-20 [&>button]:rounded-full"
    >
      <ExpandableChatHeader className="flex-col text-center justify-center bg-gradient-to-r from-[#3283FF] to-[#6E9DED]">
        <h1 className="text-xl font-semibold text-white">Chat com Lize ✨</h1>
        <p className="text-sm text-white/90">
          Sua assistente de aprendizado
        </p>
      </ExpandableChatHeader>

      <ExpandableChatBody>
        <ChatMessageList>
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleMessage
                variant={message.sender === "user" ? "sent" : "received"}
              >
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {isLoading && (
            <ChatBubble variant="received">
              <ChatBubbleMessage isLoading />
            </ChatBubble>
          )}
        </ChatMessageList>
      </ExpandableChatBody>

      <ExpandableChatFooter>
        <form
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
        >
          <ChatInput
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center p-3 pt-0 justify-between">
            <div className="flex">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleAttachFile}
              >
                <Paperclip className="size-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={handleMicrophoneClick}
              >
                <Mic className="size-4" />
              </Button>
            </div>
            <Button type="submit" size="sm" className="ml-auto gap-1.5 bg-[#3283FF] hover:bg-[#3283FF]/90">
              Enviar
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </ExpandableChatFooter>
    </ExpandableChat>
  )
}