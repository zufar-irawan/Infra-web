// oxlint-disable no-unused-vars
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();

  try {
    // Ganti URL dengan Webhook n8n kamu
    const n8nWebhookUrl = "https://kiana-k423n8n.my.id/webhook/presma-chat";

    const res = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    const data = await res.json();
    return NextResponse.json({ reply: data.reply || "Bot tidak merespon." });
  } catch (err) {
    return NextResponse.json({ reply: `⚠️ Error: tidak bisa terhubung ke n8n. ${err}` }, { status: 500 });
  }
}
