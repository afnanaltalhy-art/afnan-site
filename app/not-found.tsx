import Link from "next/link";
export default function NotFound() {
  return (
    <div className="container-x grid min-h-[60vh] place-items-center text-center">
      <div><p className="ltr text-8xl font-bold text-accent">404</p><h1 className="mt-3 text-3xl font-bold">الصفحة غير موجودة</h1><Link href="/" className="btn-primary mt-6">العودة للرئيسية</Link></div>
    </div>
  );
}
