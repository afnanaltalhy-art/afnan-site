import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-navy-950 px-6 text-center text-ivory-100">
      <div>
        <p className="text-[64px] font-extrabold text-gold-400">٤٠٤</p>
        <h1 className="mt-2 text-[24px] font-bold">هذه الصفحة غير موجودة</h1>
        <Link href="/" className="btn-gold mt-8">العودة إلى الرئيسية</Link>
      </div>
    </main>
  );
}
