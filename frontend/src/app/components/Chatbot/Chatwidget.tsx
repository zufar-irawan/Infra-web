// oxlint-disable no-unused-vars
"use client";
import { useState, useRef, useEffect } from "react";
import { Send, MessageCircle, X, Bot, User } from "lucide-react";

type Message = { sender: "user" | "bot"; text: string };

export default function ChatWidget() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    const pathname = typeof window !== "undefined" ? window.location.pathname : "";

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMsg: Message = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setIsTyping(true);

        // Kirim ke Next.js API → n8n
        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            setIsTyping(false);
            setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
        } catch (err) {
            setIsTyping(false);
            setMessages((prev) => [...prev, { sender: "bot", text: "⚠️ Error terhubung ke server." }]);
        }
    };

    // Scroll ke bottom saat ada pesan baru
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Welcome message saat pertama kali dibuka
    useEffect(() => {
        if (open && messages.length === 0) {
            setTimeout(() => {
                setMessages([
                    { 
                        sender: "bot", 
                        text: "Halo! 👋\n\nSelamat datang di SMK Prestasi Prima.\nAda yang bisa saya bantu?" 
                    }
                ]);
            }, 500);
        }
    }, [open, messages.length]);

    return (
        <div>
            {/* Floating Button */}
            {!pathname.startsWith('/edu/') && (
                <>
                    {/* Floating Button with Pulse Animation */}
                    <button
                        onClick={() => setOpen(!open)}
                        className="z-50 fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-gradient-to-br from-orange-500 to-orange-600 p-3 sm:p-4 rounded-full shadow-2xl text-white hover:from-orange-600 hover:to-orange-700 transition-all duration-300 active:scale-95 group"
                        style={{
                            boxShadow: '0 10px 40px rgba(249, 115, 22, 0.4)'
                        }}
                    >
                        {open ? (
                            <X className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:rotate-90 duration-300" />
                        ) : (
                            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110 duration-300" />
                        )}

                        {/* Pulse ring animation */}
                        {!open && (
                            <span className="absolute inset-0 rounded-full bg-orange-500 animate-ping opacity-20"></span>
                        )}
                    </button>

                    {/* Chat Window */}
                    {open && (
                        <div className="z-50 fixed bottom-20 left-2 right-2 w-auto h-[500px] max-h-[80vh] sm:bottom-24 sm:left-auto sm:right-6 sm:w-[420px] sm:h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-orange-100 animate-slideUp">
                            {/* Header with Gradient */}
                            <div className="bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 text-white p-4 sm:p-5 relative overflow-hidden">
                                <div className="absolute inset-0 bg-white opacity-10"></div>
                                <div className="relative flex items-center justify-between">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                                            <Bot className="w-4 h-4 sm:w-6 sm:h-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-base sm:text-lg">Assistant AI</h3>
                                            <p className="text-[11px] sm:text-xs text-orange-100">Online • Siap membantu</p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setOpen(false)}
                                        className="w-8 h-8 hover:bg-white/20 rounded-full transition-colors flex items-center justify-center"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Messages Area */}
                            <div className="flex-1 p-3 sm:p-4 space-y-3 sm:space-y-4 overflow-y-auto bg-gradient-to-b from-orange-50/30 to-white custom-scrollbar">
                                {messages.map((m, i) => (
                                    <div
                                        key={i}
                                        className={`flex gap-1 sm:gap-2 ${m.sender === "user" ? "justify-end" : "justify-start"} animate-fadeIn`}
                                    >
                                        {m.sender === "bot" && (
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                                <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                                            </div>
                                        )}
                                        
                                        <div
                                            className={`max-w-[75%] p-2.5 sm:p-3.5 rounded-2xl shadow-sm ${
                                                m.sender === "user"
                                                    ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-tr-sm"
                                                    : "bg-white text-gray-800 rounded-tl-sm border border-gray-100"
                                            }`}
                                        >
                                            {m.text.split("\n\n").map((para, idx) => (
                                                <p key={idx} className="mb-2 last:mb-0 text-xs sm:text-sm leading-relaxed">
                                                    {para.split("\n").map((line, id) => (
                                                        <span key={id}>
                                                            {line}
                                                            <br />
                                                        </span>
                                                    ))}
                                                </p>
                                            ))}
                                        </div>

                                        {m.sender === "user" && (
                                            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                                <User className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                                            </div>
                                        )}
                                    </div>
                                ))}

                                {/* Typing Indicator */}
                                {isTyping && (
                                    <div className="flex gap-1 sm:gap-2 items-end animate-fadeIn">
                                        <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                                            <Bot className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
                                        </div>
                                        <div className="bg-white p-3 sm:p-4 rounded-2xl rounded-tl-sm shadow-sm border border-gray-100">
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                                <span className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div ref={chatEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-3 sm:p-4 border-t border-gray-100 bg-white">
                                <div className="flex gap-2 items-end">
                                    <div className="flex-1 relative">
                                        <input
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                                            className="w-full border-2 border-gray-200 rounded-2xl px-3 py-2 sm:px-4 sm:py-3 text-gray-900 text-xs sm:text-sm focus:outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all placeholder:text-gray-400"
                                            placeholder="Ketik pesan Anda..."
                                        />
                                    </div>
                                    <button
                                        onClick={sendMessage}
                                        disabled={!input.trim()}
                                        className="bg-gradient-to-br from-orange-500 to-orange-600 p-2.5 sm:p-3.5 rounded-2xl text-white hover:from-orange-600 hover:to-orange-700 transition-all active:scale-95 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-orange-500 disabled:hover:to-orange-600"
                                        style={{
                                            boxShadow: '0 4px 15px rgba(249, 115, 22, 0.3)'
                                        }}
                                    >
                                        <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                                    </button>
                                </div>
                                <p className="text-[11px] sm:text-xs text-gray-400 mt-2 text-center">
                                    Powered by SMK Prestasi Prima AI
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Custom Styles */}
                    <style jsx>{`
                        @keyframes slideUp {
                            from {
                                opacity: 0;
                                transform: translateY(20px) scale(0.95);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0) scale(1);
                            }
                        }

                        @keyframes fadeIn {
                            from {
                                opacity: 0;
                                transform: translateY(10px);
                            }
                            to {
                                opacity: 1;
                                transform: translateY(0);
                            }
                        }

                        .animate-slideUp {
                            animation: slideUp 0.3s ease-out;
                        }

                        .animate-fadeIn {
                            animation: fadeIn 0.3s ease-out;
                        }

                        .custom-scrollbar::-webkit-scrollbar {
                            width: 6px;
                        }

                        .custom-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                        }

                        .custom-scrollbar::-webkit-scrollbar-thumb {
                            background: #fb923c;
                            border-radius: 10px;
                        }

                        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                            background: #f97316;
                        }
                    `}</style>
                </>
            )}
        </div>
    )
}