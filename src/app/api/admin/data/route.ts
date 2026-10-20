import { NextResponse } from "next/server";
import { getAdminPortfolio } from "@/lib/portfolio";
import { storageMode } from "@/lib/settings";
import { ROOT_FOLDER_ID } from "@/lib/drive";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getAdminPortfolio();
  return NextResponse.json({ ...data, storage: storageMode(), rootFolderId: ROOT_FOLDER_ID });
}
