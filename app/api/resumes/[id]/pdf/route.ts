import { getSession } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const API_BASE = "https://api.socratic.pro";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const token = await getSession();
  if (!token) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const upstream = await fetch(`${API_BASE}/api/v1/resumes/${id}/pdf`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!upstream.ok) {
    return new NextResponse("Failed to fetch PDF", { status: upstream.status });
  }

  const pdf = await upstream.arrayBuffer();
  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resume-${id}.pdf"`,
    },
  });
}
