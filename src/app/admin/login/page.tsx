import { Suspense } from "react";
import LoginForm from "./LoginForm";

export default function LoginPage() {
  return (
    <main className="grain relative grid min-h-screen place-items-center overflow-hidden bg-navy-950 px-5">
      <div className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full border border-gold/15" />
      <div className="relative w-full max-w-sm rounded-3xl border border-gold/25 bg-ivory-50 p-8 shadow-2xl">
        <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-full border border-gold/50 text-2xl font-extrabold text-gold-600">أ</span>
        <h1 className="text-center text-[22px] font-extrabold text-navy">لوحة إدارة ملف الإنجاز</h1>
        <p className="mb-7 mt-1 text-center text-[14px] text-navy-500">خاصة بـ د. أفنان الطلحي</p>
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </main>
  );
}
