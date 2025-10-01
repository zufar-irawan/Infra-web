// oxlint-disable no-unused-vars
"use client";
import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle } from "lucide-react";

type Message = { sender: "user" | "bot"; text: string };

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const chatEndRef = useRef<HTMLDivElement>(null);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");

        // Kirim ke Next.js API → n8n
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
        } catch (err) {
            setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Error terhubung ke server." }]);
        }
    };

    // Scroll ke bottom saat ada pesan baru
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div>
            {/* Floating Button */}
            <button
                onClick={() => setOpen(!open)}
                className="z-50 fixed bottom-6 right-6 bg-blue-600 p-4 rounded-full shadow-2xl text-white hover:bg-blue-700 transition-transform active:scale-95"
            >
                <MessageCircle className="w-6 h-6" />
            </button>

            {/* Chat Window */}
            {open && (
                <div className="z-50 fixed bottom-20 right-6 w-96 max-h-[600px] bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-4 text-lg font-semibold rounded-t-3xl">
                        Chatbot
                    </div>

                    {/* Messages */}
                    <div className="flex-1 p-4 space-y-3 overflow-y-auto custom-scrollbar">
                        {messages.map((m, i) => (
                            <div
                                key={i}
                                className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                            >
                                <div
                                    className={`p-3 rounded-2xl shadow-md break-words ${m.sender === "user"
                                        ? "bg-gradient-to-r from-blue-200 to-blue-100 text-gray-900"
                                        : "bg-gray-100 text-gray-900"
                                        }`}
                                >
                                    {m.text.split("\n\n").map((para, idx) => (
                                        <p key={idx} className="mb-2 last:mb-0">
                                            {para.split("\n").map((line, id) => (
                                                <span key={id}>
                                                    {line}
                                                    <br />
                                                </span>
                                            ))}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                        <div ref={chatEndRef} />
                    </div>

                    {/* Input */}
                    <div className="flex p-3 border-t border-gray-200 bg-gray-50">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            className="flex-1 border rounded-2xl px-4 py-2 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Tulis pesan..."
                        />
                        <button
                            onClick={sendMessage}
                            className="ml-2 bg-blue-600 p-3 rounded-full text-white hover:bg-blue-700 transition-transform active:scale-90"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
