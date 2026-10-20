"use client";
import { useEffect, useState } from "react";
import { api, fmtDate } from "@/components/admin/client";
import { Card, Confirm, PageHead, useToast } from "@/components/admin/ui";

type R = { id: string; name: string; contact: string; type: string; details: string; status: string; createdAt: string };
const ST: Record<string, [string, string]> = { new: ["جديد", "bg-accent/30"], in_progress: ["قيد التنفيذ", "bg-sky/20"], done: ["مكتمل", "bg-brand/20"], archived: ["مؤرشف", "bg-navy/10"] };

export default function Page() {
  const [list, setList] = useState<R[] | null>(null);
  const [f, setF] = useState("all");
  const toast = useToast();
  const load = () => api<R[]>("/api/admin/requests").then(setList).catch((e) => { toast(e.message, "err"); setList([]); });
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const shown = (list ?? []).filter((r) => f === "all" || r.status === f);
  return (
    <>
      <PageHead title="طلبات العملاء" sub="الطلبات الواردة من نموذج «اطلبي تصميمك»" />
      <div className="mb-4 flex flex-wrap gap-2">{["all", ...Object.keys(ST)].map((k) => <button key={k} onClick={() => setF(k)} className={`rounded-full px-4 py-1.5 text-sm font-bold ${f === k ? "bg-navy text-white" : "bg-white"}`}>{k === "all" ? "الكل" : ST[k][0]} {k !== "all" && list ? `(${list.filter((r) => r.status === k).length})` : ""}</button>)}</div>
      <div className="grid gap-4">
        {list === null ? <p>جارٍ التحميل…</p> : shown.length === 0 ? <Card><p className="text-navy/50">لا توجد طلبات.</p></Card> : shown.map((r) => (
          <Card key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-bold">{r.name} <span className={`mr-2 rounded-full px-2.5 py-0.5 text-xs ${ST[r.status]?.[1]}`}>{ST[r.status]?.[0]}</span></p>
                <p className="text-sm text-navy/60">{r.type} • {fmtDate(r.createdAt)} • <span dir="ltr">{r.contact}</span></p>
              </div>
              <div className="flex items-center gap-2">
                <select aria-label="الحالة" className="input !w-auto !py-1.5" value={r.status} onChange={async (e) => { try { await api(`/api/admin/requests/${r.id}`, "PATCH", { status: e.target.value }); load(); } catch (er) { toast((er as Error).message, "err"); } }}>
                  {Object.entries(ST).map(([k, [l]]) => <option key={k} value={k}>{l}</option>)}
                </select>
                <Confirm onYes={async () => { try { await api(`/api/admin/requests/${r.id}`, "DELETE"); toast("حُذف"); load(); } catch (e) { toast((e as Error).message, "err"); } }} />
              </div>
            </div>
            <p className="mt-3 whitespace-pre-wrap rounded-2xl bg-navy/[.03] p-4 leading-8">{r.details}</p>
          </Card>
        ))}
      </div>
    </>
  );
}
