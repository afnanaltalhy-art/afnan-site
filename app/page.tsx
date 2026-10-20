import Image from "next/image";
import Link from "next/link";
import { getSettings } from "@/lib/settings";
import { getLessons, getPortfolio, getQuizzes } from "@/lib/data";
import { LABS } from "@/lib/labs";
import HeroScene from "@/components/site/HeroScene";
import LessonCardView from "@/components/site/LessonCardView";
import Reveal from "@/components/ui/Reveal";
import SectionTitle from "@/components/ui/SectionTitle";
import { IconBook, IconChat, IconGallery, IconLink, IconMail, IconSend, IconTrophy } from "@/components/ui/Icons";

export default async function Home() {
  const [s, lessons, quizzes, portfolio] = await Promise.all([getSettings(), getLessons(), getQuizzes(), getPortfolio()]);
  const contacts = [
    s.contact.email && { href: `mailto:${s.contact.email}`, label: s.contact.email, Icon: IconMail },
    s.contact.whatsapp && { href: `https://wa.me/${s.contact.whatsapp.replace(/\D/g, "")}`, label: "واتساب", Icon: IconChat },
    s.contact.x && { href: s.contact.x, label: "منصة X", Icon: IconLink },
    s.contact.instagram && { href: s.contact.instagram, label: "إنستغرام", Icon: IconLink },
    s.contact.telegram && { href: s.contact.telegram, label: "تيليجرام", Icon: IconLink },
    s.contact.youtube && { href: s.contact.youtube, label: "يوتيوب", Icon: IconLink },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof IconMail }[];

  return (
    <>
      <section className="relative overflow-hidden">
        <div className="container-x grid items-center gap-6 pb-10 pt-8 lg:grid-cols-2 lg:pt-14">
          <Reveal>
            <span className="chip">{s.tagline}</span>
            <h1 className="mt-5 bg-gradient-to-l from-white via-cream to-accent bg-clip-text text-5xl font-bold leading-[1.25] text-transparent sm:text-7xl">{s.siteName}</h1>
            <p className="mt-4 text-2xl font-bold text-cream sm:text-3xl">{s.heroTitle}</p>
            <p className="mt-4 max-w-xl text-lg leading-9 text-white/75">{s.heroSubtitle}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/lessons/genetics" className="btn-primary text-lg">جرّبي درس علم الوراثة</Link>
              <Link href="/labs" className="btn-ghost text-lg">المختبرات الافتراضية</Link>
            </div>
            <dl className="mt-10 grid max-w-md grid-cols-3 gap-3 text-center">
              {[[String(lessons.length), "درس"], [String(LABS.length), "مختبر"], [String(quizzes.length), "مسابقة"]].map(([n, l]) => (
                <div key={l} className="glass p-3"><dt className="sr-only">{l}</dt><dd className="ltr text-3xl font-bold text-accent">{n}</dd><dd className="text-sm text-white/65">{l}</dd></div>
              ))}
            </dl>
          </Reveal>
          <HeroScene />
        </div>
      </section>

      <section className="container-x py-16" id="lessons">
        <SectionTitle kicker="مكتبة الدروس" title="دروس تعليمية تفاعلية" lead="كل درس تجربة رقمية كاملة: شرح متسلسل، ومحاكاة، وأنشطة، وتقويم." />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {lessons.slice(0, 6).map((l, i) => <Reveal key={l.id} delay={i * 0.08}><LessonCardView l={l} /></Reveal>)}
        </div>
        <div className="mt-8 text-center"><Link href="/lessons" className="btn-ghost"><IconBook /> كل الدروس</Link></div>
      </section>

      <section className="container-x py-16" id="labs">
        <SectionTitle kicker="المحاكاة والمختبرات الافتراضية" title="جرّبي العلم بيديكِ" lead="مختبرات تفاعلية ثلاثية الأبعاد تعمل على الجوال والحاسب والسبورة الذكية." />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {LABS.map((l, i) => (
            <Reveal key={l.id} delay={i * 0.05}>
              <Link href={`/labs/${l.id}`} className="glass group flex h-full flex-col p-5 transition hover:-translate-y-1 hover:ring-2 hover:ring-accent/60">
                <span className="text-5xl transition group-hover:scale-110">{l.emoji}</span>
                <h3 className="mt-3 text-xl font-bold">{l.title}</h3>
                <p className="mt-2 leading-7 text-white/70">{l.desc}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-x py-16" id="games">
        <div className="glass relative overflow-hidden p-8 sm:p-12">
          <div className="pointer-events-none absolute -left-10 -top-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative grid items-center gap-8 lg:grid-cols-2">
            <div>
              <span className="chip"><IconTrophy className="h-4 w-4" /> الألعاب والمسابقات</span>
              <h2 className="h-section mt-3">مسابقة نجمات العلوم</h2>
              <p className="mt-3 leading-8 text-white/75">مجموعات تتنافس بالنقاط، ومؤقت زمني، ومؤثرات صوتية، ولوحة ترتيب حيّة، وتغذية راجعة فورية، وشاشة احتفالية للفائزة.</p>
              <Link href="/games" className="btn-primary mt-6">ابدئي مسابقة</Link>
            </div>
            <ul className="grid gap-3">
              {quizzes.slice(0, 4).map((q) => (
                <li key={q.id}><Link href={`/games/${q.id}`} className="flex items-center justify-between rounded-2xl bg-white/5 p-4 transition hover:bg-white/10"><span className="font-bold">{q.title}</span><span className="text-sm text-white/60">{q.questions.length} سؤالًا</span></Link></li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-x py-16" id="portfolio">
        <SectionTitle kicker="معرض الأعمال" title="عروض ودروس تفاعلية" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 0.08}>
              <a href={p.link || "/portfolio"} className="glass group block overflow-hidden">
                <div className="relative h-44 bg-white">{p.imageUrl ? <Image src={p.imageUrl} alt={p.title} fill className="object-cover transition group-hover:scale-105" unoptimized={p.imageUrl.startsWith("http")} /> : <div className="grid h-full place-items-center bg-gradient-to-br from-violet to-brand-deep text-5xl"><IconGallery className="h-12 w-12" /></div>}</div>
                <div className="p-5">{p.category && <span className="text-sm text-accent">{p.category}</span>}<h3 className="mt-1 text-xl font-bold">{p.title}</h3>{p.description && <p className="mt-2 leading-7 text-white/70">{p.description}</p>}</div>
              </a>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center"><Link href="/portfolio" className="btn-ghost"><IconGallery /> المعرض كاملًا</Link></div>
      </section>

      <section className="container-x py-16" id="request">
        <div className="grid items-center gap-8 rounded-[2rem] bg-gradient-to-l from-brand-deep to-brand p-8 sm:p-12 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="h-section">اطلبي تصميم عرض أو موقع تعليمي</h2>
            <p className="mt-3 text-lg leading-8 text-white/85">{s.requestIntro}</p>
          </div>
          <Link href="/request" className="btn-primary justify-self-start text-lg lg:justify-self-end"><IconSend /> أرسلي طلبك</Link>
        </div>
      </section>

      <section className="container-x py-16" id="contact">
        <SectionTitle kicker="وسائل التواصل" title="عن د. أفنان" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="glass p-6 leading-9 text-white/80 lg:col-span-2">{s.about}</div>
          <div className="glass grid content-start gap-3 p-6">
            {contacts.length ? contacts.map(({ href, label, Icon }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 rounded-2xl bg-white/5 p-3 font-bold transition hover:bg-white/10"><Icon className="h-5 w-5 text-accent" /> {label}</a>
            )) : <p className="text-white/60">للتواصل والتعاون استخدمي نموذج الطلب.</p>}
            <Link href="/request" className="btn-brand"><IconSend /> نموذج التواصل</Link>
          </div>
        </div>
      </section>
    </>
  );
}
