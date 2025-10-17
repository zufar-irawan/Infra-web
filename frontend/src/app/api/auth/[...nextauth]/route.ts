import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
	return NextResponse.json(
		{
			success: false,
			message: "NextAuth belum dikonfigurasi di environment ini.",
		},
		{ status: 501 }
	);
}

export async function POST() {
	return NextResponse.json(
		{
			success: false,
			message: "NextAuth belum dikonfigurasi di environment ini.",
		},
		{ status: 501 }
	);
}
