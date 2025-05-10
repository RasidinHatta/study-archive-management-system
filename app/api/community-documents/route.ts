// app/api/community-documents/route.ts
import { getCommunityDocuments } from "@/data/document";
import { NextResponse } from "next/server";

export async function GET() {
  const documents = await getCommunityDocuments();
  return NextResponse.json(documents);
}
