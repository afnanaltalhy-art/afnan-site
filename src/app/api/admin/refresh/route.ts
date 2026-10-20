import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { DRIVE_TAG } from "@/lib/drive";

export async function POST() {
  revalidateTag(DRIVE_TAG);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
