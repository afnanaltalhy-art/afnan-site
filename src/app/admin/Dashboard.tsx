"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  FolderOpen,
  Loader2,
  LogOut,
  Plus,
  RefreshCw,
  Save,
  Search,
  Trash2,
  TriangleAlert,
} from "lucide-react";
import FileIcon, { KIND_TINT } from "@/components/FileIcon";
import { ar, cleanFolderName, displayName, folderUrl, openUrl } from "@/lib/fileTypes";
import type { Achievement, PortfolioData, SiteSettings } from "@/lib/types";

type AdminData = PortfolioData & { storage: "kv" | "local" | "none"; rootFolderId: string };
type Tab = "overview" | "sections" | "achievements" | "documents";

const TABS: { key: Tab; label: string }[] = [
  { key: "overview", label: "نظرة عامة" },
  { key: "sections", label: "الأقسام" },
  { key: "achievements", label: "الإنجازات" },
  { key: "documents", label: "الوثائق" },
];

function move<T>(arr: T[], i: number, d: number) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const out = arr.slice();
  [out[i], out[j]] = [out[j], out[i]];
  return out;
}

export default function Dashboard() {
  const [data, setData] = useState<AdminData | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [saved, setSaved] = useState("");
  const [tab, setTab] = useState<Tab>("overview");
  const [busy, setBusy] = useState<"" | "load" | "save" | "refresh">("load");
  const [toast, setToast] = useState<{ ok: boolean; text: string } | null>(null);

  const load = useCallback(async () => {
    setBusy("load");
    const res = await fetch("/api/admin/data", { cache: "no-store" });
    if (res.status === 401) return (window.location.href = "/admin/login");
    const json = (await res.json()) as AdminData;
    setData(json);
    setSettings(json.settings);
    setSaved(JSON.stringify(json.settings));
    setBusy("");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(t);
  }, [toast]);

  const dirty = settings !== null && JSON.stringify(settings) !== saved;

  useEffect(() => {
    const warn = (e: BeforeUnloadEvent) => {
      if (dirty) e.preventDefault();
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  async function save() {
    if (!settings) return;
    setBusy("save");
    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...settings, sections: settings.sections.map((s, i) => ({ ...s, order: i })) }),
    });
    const json = await res.json().catch(() => ({}));
    setBusy("");
    if (res.ok) {
      setSettings(json.settings);
      setSaved(JSON.stringify(json.settings));
      setToast({ ok: true, text: "حُفظت التعديلات ونُشرت على الموقع" });
    } else setToast({ ok: false, text: json.error ?? "تعذر الحفظ" });
  }

  async function refresh() {
    setBusy("refresh");
    await fetch("/api/admin/refresh", { method: "POST" });
    await load();
    setToast({ ok: true, text: "تم تحديث المحتوى من Google Drive" });
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (!data || !settings) {
    return (
      <div className="grid min-h-screen place-items-center text-navy-500">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="pb-28">
      <header className="sticky top-0 z-40 border-b border-gold/20 bg-navy-950 text-ivory-100">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-5">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/50 font-extrabold text-gold-300">أ</span>
          <h1 className="flex-1 truncate text-[15px] font-bold">لوحة إدارة ملف الإنجاز</h1>
          <Link href="/" target="_blank" className="hidden items-center gap-1.5 text-[13px] text-ivory-200 hover:text-gold-300 sm:inline-flex">
            <ExternalLink size={14} /> عرض الموقع
          </Link>
          <button type="button" onClick={logout} className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 px-3 py-1.5 text-[13px] hover:bg-white/5">
            <LogOut size={14} /> خروج
          </button>
        </div>
        <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5" aria-label="أقسام اللوحة">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              aria-current={tab === t.key ? "page" : undefined}
              className={`shrink-0 border-b-2 px-4 py-3 text-[14px] transition ${tab === t.key ? "border-gold-400 text-gold-300" : "border-transparent text-ivory-200/70 hover:text-ivory-50"}`}
            >
              {t.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8">
        {tab === "overview" && <Overview data={data} onRefresh={refresh} refreshing={busy === "refresh"} />}
        {tab === "sections" && <Sections data={data} settings={settings} setSettings={setSettings} />}
        {tab === "achievements" && <Achievements settings={settings} setSettings={setSettings} />}
        {tab === "documents" && <Documents data={data} settings={settings} setSettings={setSettings} />}
      </main>

      {(dirty || busy === "save") && (
        <div className="fixed inset-x-0 bottom-0 z-50 border-t border-gold/30 bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-3">
            <p className="text-[14px] text-navy-600">لديكِ تعديلات غير محفوظة</p>
            <div className="flex gap-2">
              <button type="button" className="btn-line" onClick={() => setSettings(JSON.parse(saved))}>
                تراجع
              </button>
              <button type="button" className="btn-gold !py-2" onClick={save} disabled={busy === "save"}>
                {busy === "save" ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                حفظ ونشر
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div role="status" className={`fixed bottom-20 left-1/2 z-[60] -translate-x-1/2 rounded-full px-5 py-2.5 text-[14px] shadow-lg ${toast.ok ? "bg-navy text-ivory-50" : "bg-[#9a3f2b] text-white"}`}>
          {toast.text}
        </div>
      )}
    </div>
  );
}

function Card({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-navy/[.08] bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-[18px] font-extrabold text-navy">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Overview({ data, onRefresh, refreshing }: { data: AdminData; onRefresh: () => void; refreshing: boolean }) {
  const total = data.files.length;
  const pub = data.files.filter((f) => f.isPublic && !data.settings.hiddenFileIds.includes(f.id)).length;
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card
        title="الربط مع Google Drive"
        action={
          <button type="button" onClick={onRefresh} disabled={refreshing} className="btn-line">
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> تحديث المحتوى الآن
          </button>
        }
      >
        {data.status.ok ? (
          <div className="space-y-3 text-[15px] text-navy-600">
            <p className="flex items-center gap-2 font-bold text-[#2c6e43]">
              <CheckCircle2 size={18} /> متصل ({data.status.mode === "api-key" ? "مفتاح API — الملفات العامة فقط" : "حساب خدمة"})
            </p>
            <p>المجلد الرئيسي: {data.root?.name}</p>
            <p>
              {ar(total)} وثيقة، منها {ar(pub)} ظاهرة للزوار
            </p>
            <p className="text-[13px] text-navy-500">يتحدّث الموقع تلقائيًا كل ١٠ دقائق، أو فورًا بزر التحديث.</p>
          </div>
        ) : (
          <p className="flex gap-2 text-[15px] leading-loose text-[#9a3f2b]">
            <TriangleAlert size={18} className="mt-1 shrink-0" /> {data.status.message}
          </p>
        )}
        <a href={folderUrl(data.rootFolderId)} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-bold text-gold-700 underline underline-offset-4">
          <FolderOpen size={15} /> فتح المجلد لإضافة وثائق جديدة
        </a>
      </Card>

      <Card title="حفظ إعدادات اللوحة">
        {data.storage === "none" ? (
          <p className="flex gap-2 text-[15px] leading-loose text-[#9a3f2b]">
            <TriangleAlert size={18} className="mt-1 shrink-0" /> التعديلات لن تُحفظ حتى تُضاف قاعدة Upstash Redis (أو Vercel KV) من إعدادات المشروع في Vercel.
          </p>
        ) : (
          <p className="flex items-center gap-2 text-[15px] font-bold text-[#2c6e43]">
            <CheckCircle2 size={18} /> {data.storage === "kv" ? "التخزين السحابي مفعّل" : "تخزين محلي (بيئة التطوير)"}
          </p>
        )}
        {data.settings.updatedAt && <p className="mt-3 text-[13px] text-navy-500">آخر حفظ: {new Date(data.settings.updatedAt).toLocaleString("ar-SA")}</p>}
      </Card>

      <Card title="المجلدات الرئيسية">
        {data.root?.folders.length ? (
          <ul className="space-y-2">
            {data.root.folders.map((f) => {
              const key = (Object.keys(data.sectionFolders) as (keyof typeof data.sectionFolders)[]).find((k) => data.sectionFolders[k]?.id === f.id);
              const section = data.settings.sections.find((s) => s.key === key);
              return (
                <li key={f.id} className="flex items-center justify-between gap-3 rounded-xl bg-ivory-100 px-4 py-3 text-[14px]">
                  <span className="truncate font-bold text-navy">{f.name}</span>
                  <span className="shrink-0 text-navy-500">{section ? `← ${section.title}` : "غير مربوط"}</span>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[14px] text-navy-500">لا تظهر مجلدات بعد.</p>
        )}
      </Card>

      <Card title="الإنجازات المضافة يدويًا">
        <p className="text-[15px] text-navy-600">{ar(data.settings.achievements.length)} إنجاز</p>
        <p className="mt-2 text-[13px] text-navy-500">تظهر في الصفحة الرئيسية تحت «أبرز الإنجازات».</p>
      </Card>
    </div>
  );
}

function Sections({ data, settings, setSettings }: { data: AdminData; settings: SiteSettings; setSettings: (s: SiteSettings) => void }) {
  const update = (i: number, patch: Partial<SiteSettings["sections"][number]>) =>
    setSettings({ ...settings, sections: settings.sections.map((s, j) => (j === i ? { ...s, ...patch } : s)) });
  return (
    <div className="space-y-4">
      <p className="text-[14px] text-navy-500">غيّري عناوين الأقسام وترتيبها وظهورها، واختاري مجلد Drive الذي يُعرض في كل قسم.</p>
      {settings.sections.map((s, i) => (
        <section key={s.key} className={`rounded-3xl border bg-white p-5 sm:p-6 ${s.visible ? "border-navy/[.08]" : "border-dashed border-navy/20 opacity-70"}`}>
          <div className="mb-4 flex items-center gap-2">
            <span className="text-[15px] font-bold text-gold-600">{(i + 1).toLocaleString("ar-SA")}</span>
            <span className="flex-1" />
            <button type="button" className="btn-line !px-2.5" onClick={() => setSettings({ ...settings, sections: move(settings.sections, i, -1) })} disabled={i === 0} aria-label="نقل لأعلى">
              <ArrowUp size={14} />
            </button>
            <button type="button" className="btn-line !px-2.5" onClick={() => setSettings({ ...settings, sections: move(settings.sections, i, 1) })} disabled={i === settings.sections.length - 1} aria-label="نقل لأسفل">
              <ArrowDown size={14} />
            </button>
            <button type="button" className="btn-line" onClick={() => update(i, { visible: !s.visible })}>
              {s.visible ? <Eye size={14} /> : <EyeOff size={14} />} {s.visible ? "ظاهر" : "مخفي"}
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label>
              <span className="mb-1 block text-[13px] font-bold text-navy-600">العنوان</span>
              <input className="field" value={s.title} onChange={(e) => update(i, { title: e.target.value })} />
            </label>
            <label>
              <span className="mb-1 block text-[13px] font-bold text-navy-600">الوصف</span>
              <input className="field" value={s.subtitle} onChange={(e) => update(i, { subtitle: e.target.value })} />
            </label>
            {s.key !== "evidence" && (
              <label className="md:col-span-2">
                <span className="mb-1 block text-[13px] font-bold text-navy-600">مجلد Drive</span>
                <select className="field" value={s.folderId} onChange={(e) => update(i, { folderId: e.target.value })}>
                  <option value="">تلقائي{data.sectionFolders[s.key] ? ` (${data.sectionFolders[s.key]!.name})` : ""}</option>
                  {data.root?.folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </label>
            )}
            {s.key === "evidence" && <p className="text-[13px] text-navy-500 md:col-span-2">مكتبة الشواهد تجمع وثائق كل المجلدات مع فلاتر حسب المجال.</p>}
          </div>
        </section>
      ))}
    </div>
  );
}

const EMPTY: Omit<Achievement, "id" | "order"> = { title: "", date: "", category: "", description: "", url: "", visible: true };

function Achievements({ settings, setSettings }: { settings: SiteSettings; setSettings: (s: SiteSettings) => void }) {
  const list = settings.achievements;
  const set = (achievements: Achievement[]) => setSettings({ ...settings, achievements: achievements.map((a, i) => ({ ...a, order: i })) });
  const update = (i: number, patch: Partial<Achievement>) => set(list.map((a, j) => (j === i ? { ...a, ...patch } : a)));
  const add = () => set([{ ...EMPTY, id: crypto.randomUUID(), order: 0 }, ...list]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[14px] text-navy-500">أضيفي إنجازاتك لتظهر في الصفحة الرئيسية، ويمكن ربط كل إنجاز بشاهده في Drive.</p>
        <button type="button" className="btn-gold !py-2" onClick={add}>
          <Plus size={16} /> إضافة إنجاز
        </button>
      </div>
      {list.length === 0 && <p className="rounded-3xl border border-dashed border-navy/20 bg-white py-14 text-center text-navy-500">لا توجد إنجازات بعد. ابدئي بزر «إضافة إنجاز».</p>}
      {list.map((a, i) => (
        <section key={a.id} className={`rounded-3xl border bg-white p-5 sm:p-6 ${a.visible ? "border-navy/[.08]" : "border-dashed border-navy/20 opacity-70"}`}>
          <div className="mb-4 flex items-center gap-2">
            <span className="flex-1 truncate text-[15px] font-bold text-navy">{a.title || "إنجاز جديد"}</span>
            <button type="button" className="btn-line !px-2.5" onClick={() => set(move(list, i, -1))} disabled={i === 0} aria-label="نقل لأعلى">
              <ArrowUp size={14} />
            </button>
            <button type="button" className="btn-line !px-2.5" onClick={() => set(move(list, i, 1))} disabled={i === list.length - 1} aria-label="نقل لأسفل">
              <ArrowDown size={14} />
            </button>
            <button type="button" className="btn-line !px-2.5" onClick={() => update(i, { visible: !a.visible })} aria-label={a.visible ? "إخفاء" : "إظهار"}>
              {a.visible ? <Eye size={14} /> : <EyeOff size={14} />}
            </button>
            <button
              type="button"
              className="btn-line !px-2.5 hover:!border-[#9a3f2b] hover:!text-[#9a3f2b]"
              onClick={() => confirm("حذف هذا الإنجاز؟") && set(list.filter((_, j) => j !== i))}
              aria-label="حذف"
            >
              <Trash2 size={14} />
            </button>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="md:col-span-3">
              <span className="mb-1 block text-[13px] font-bold text-navy-600">عنوان الإنجاز</span>
              <input className="field" value={a.title} onChange={(e) => update(i, { title: e.target.value })} />
            </label>
            <label>
              <span className="mb-1 block text-[13px] font-bold text-navy-600">التاريخ</span>
              <input className="field" value={a.date} placeholder="مثال: ربيع الأول ١٤٤٨هـ" onChange={(e) => update(i, { date: e.target.value })} />
            </label>
            <label>
              <span className="mb-1 block text-[13px] font-bold text-navy-600">المجال</span>
              <input className="field" value={a.category} placeholder="مثال: مبادرات" onChange={(e) => update(i, { category: e.target.value })} />
            </label>
            <label>
              <span className="mb-1 block text-[13px] font-bold text-navy-600">رابط الشاهد</span>
              <input className="field" dir="ltr" value={a.url} placeholder="https://drive.google.com/…" onChange={(e) => update(i, { url: e.target.value })} />
            </label>
            <label className="md:col-span-3">
              <span className="mb-1 block text-[13px] font-bold text-navy-600">الوصف</span>
              <textarea className="field min-h-[96px]" value={a.description} onChange={(e) => update(i, { description: e.target.value })} />
            </label>
          </div>
        </section>
      ))}
    </div>
  );
}

function Documents({ data, settings, setSettings }: { data: AdminData; settings: SiteSettings; setSettings: (s: SiteSettings) => void }) {
  const [q, setQ] = useState("");
  const [only, setOnly] = useState<"all" | "visible" | "hidden" | "private">("all");
  const hidden = useMemo(() => new Set(settings.hiddenFileIds), [settings.hiddenFileIds]);
  const rows = data.files.filter((f) => {
    if (q && !(f.name + f.path.join(" ")).includes(q)) return false;
    const vis = f.isPublic && !hidden.has(f.id);
    if (only === "visible") return vis;
    if (only === "hidden") return hidden.has(f.id);
    if (only === "private") return !f.isPublic;
    return true;
  });
  const toggle = (id: string) =>
    setSettings({ ...settings, hiddenFileIds: hidden.has(id) ? settings.hiddenFileIds.filter((x) => x !== id) : [...settings.hiddenFileIds, id] });

  return (
    <div>
      <p className="mb-4 text-[14px] leading-relaxed text-navy-500">
        تُضاف الوثائق برفعها إلى مجلد Drive، وتظهر هنا تلقائيًا. يمكنك إخفاء أي وثيقة عن الزوار. الوثائق غير المشاركة بالرابط تبقى خاصة ولا تظهر للزوار أبدًا.
      </p>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <Search size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-navy-300" />
          <input className="field !pr-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="ابحثي عن وثيقة…" aria-label="بحث" />
        </label>
        <select className="field sm:!w-52" value={only} onChange={(e) => setOnly(e.target.value as typeof only)} aria-label="تصفية">
          <option value="all">كل الوثائق ({ar(data.files.length)})</option>
          <option value="visible">الظاهرة للزوار</option>
          <option value="hidden">المخفية يدويًا</option>
          <option value="private">الخاصة (غير مشاركة)</option>
        </select>
      </div>
      {data.files.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-navy/20 bg-white py-14 text-center text-navy-500">لا توجد وثائق مقروءة من Drive بعد.</p>
      ) : (
        <ul className="divide-y divide-navy/[.06] rounded-3xl border border-navy/[.08] bg-white px-4">
          {rows.map((f) => {
            const isHidden = hidden.has(f.id);
            return (
              <li key={f.id} className="flex items-center gap-3 py-3">
                <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${KIND_TINT[f.kind]}`}>
                  <FileIcon kind={f.kind} size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <a href={openUrl(f)} target="_blank" rel="noopener noreferrer" className="block truncate text-[14px] font-bold text-navy hover:text-gold-700">
                    {displayName(f.name)}
                  </a>
                  <span className="block truncate text-[12px] text-navy-500">{f.path.map(cleanFolderName).join(" / ")}</span>
                </div>
                {!f.isPublic ? (
                  <span className="shrink-0 rounded-full bg-ivory-200 px-2.5 py-1 text-[12px] text-navy-500">خاصة</span>
                ) : (
                  <button type="button" onClick={() => toggle(f.id)} className={`btn-line shrink-0 !px-3 !py-1.5 !text-[12px] ${isHidden ? "!text-navy-300" : ""}`}>
                    {isHidden ? <EyeOff size={13} /> : <Eye size={13} />} {isHidden ? "مخفية" : "ظاهرة"}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
