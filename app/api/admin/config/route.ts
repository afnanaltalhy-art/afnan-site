import { adminRoute, ok } from "@/lib/api";
import { hasDb } from "@/lib/db";
export const GET = adminRoute(async () => ok({ db: hasDb, blob: Boolean(process.env.BLOB_READ_WRITE_TOKEN) }), false);
