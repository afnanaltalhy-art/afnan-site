"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { G, PartHeader, Slide, ThinkCard } from "./ui";
import SortActivity from "./SortActivity";
import IncompleteDominanceLab from "@/components/labs/IncompleteDominanceLab";
import SexDeterminationLab from "@/components/labs/SexDeterminationLab";
import PedigreeLab from "@/components/labs/PedigreeLab";
import GenerationsLab from "@/components/labs/GenerationsLab";
import { DnaHelix3D } from "@/components/three";
import { sfx } from "@/lib/sound";

const REAL = [
  { h: "النمر الأبيض", t: "يولد من أبوين برتقاليين يحمل كلٌّ منهما جينًا متنحيًا للون الأبيض.. تمامًا كجيل مندل الثاني!" },
  { h: "القطط ثلاثية الألوان", t: "تكاد تكون كلها إناثًا؛ لأن جين لون الفراء محمول على كروموسوم X." },
  { h: "ذبابة الفاكهة", t: "نحو 75% من جينات أمراض الإنسان لها جينات مشابهة فيها؛ لذلك يدرسها العلماء بكثرة." },
  { h: "35 سنة من النسيان", t: "نشر مندل نتائجه عام 1866م فلم يهتم بها أحد، حتى أُعيد اكتشافها عام 1900م." },
];

function RealCard({ h, t }: { h: string; t: string }) {
  const [o, setO] = useState(false);
  return (
    <button onClick={() => { setO(!o); sfx.reveal(); }} className={`min-h-[11rem] rounded-3xl p-5 text-right transition ${o ? "bg-cream text-navy" : "bg-gradient-to-br from-violet to-[#4b3399]"}`}>
      <h4 className={`text-xl font-bold ${o ? "text-brand-deep" : ""}`}>{h}</h4>
      {o ? <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 text-lg leading-8">{t}</motion.p> : <span className="mt-4 block text-6xl font-bold text-white/70">?</span>}
    </button>
  );
}

const MAP_SOLVED = [
  ["الجين السائد", "حرف كبير، يظهر ويخفي الآخر"],
  ["الجينات المتقابلة", "زوج جينات لصفة واحدة"],
  ["مربع بانيت", "يتوقع نتائج التزاوج"],
  ["الجين المتنحي", "حرف صغير، يظهر في tt فقط"],
  ["الطرز الجينية", "الحروف: TT، Tt، tt"],
  ["الطرز الشكلية", "المظهر: طويل أو قصير"],
];

const VENN = {
  homo: ["جينان متشابهان", "TT أو tt", "صفة نقية تتكرر كل جيل"],
  both: ["جينان لكل صفة", "جين من كل أب", "قد يظهر بالصفة السائدة"],
  het: ["جينان مختلفان", "Tt", "هجين يحمل صفة مختبئة"],
};

function ConceptMapSolved() {
  const [n, setN] = useState(0);
  return (
    <div>
      <div className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full mx-auto rounded-full bg-gradient-to-br from-brand to-brand-deep px-10 py-5 text-3xl font-bold shadow-2xl ring-4 ring-accent/40">علم الوراثة</div>
        {MAP_SOLVED.map(([c, d], i) => (
          <div key={c} className="rounded-3xl bg-white/5 p-4 text-center ring-1 ring-white/10">
            <p className="text-xl font-bold text-accent">{c}</p>
            <motion.p animate={i < n ? { opacity: 1 } : { opacity: 0.1 }} className="mt-2 rounded-2xl bg-cream p-3 text-navy">{i < n ? d : "؟"}</motion.p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-3"><button className="btn-primary" disabled={n >= 6} onClick={() => { setN(n + 1); sfx.reveal(); }}>أظهري الإجابة التالية</button><button className="btn-ghost" onClick={() => setN(6)}>إظهار الكل</button><button className="btn-ghost" onClick={() => setN(0)}>إعادة</button></div>
    </div>
  );
}

function VennSolved() {
  const [show, setShow] = useState(false);
  return (
    <div>
      <div className="relative mx-auto grid max-w-4xl grid-cols-3 items-stretch">
        {(["homo", "both", "het"] as const).map((k) => (
          <div key={k} className={`rounded-[3rem] p-5 text-center ${k === "homo" ? "bg-brand/35" : k === "het" ? "bg-violet/40" : "z-10 -mx-6 bg-accent/30 ring-2 ring-accent"}`}>
            <p className="mb-3 font-bold text-accent">{k === "homo" ? "متماثل الجينات" : k === "het" ? "غير متماثل الجينات" : "أوجه الشبه"}</p>
            <ul className="grid gap-2">{VENN[k].map((x) => <motion.li key={x} animate={show ? { opacity: 1 } : { opacity: 0.1 }} className="rounded-xl bg-black/20 p-2 text-sm sm:text-base">{show ? x : "؟"}</motion.li>)}</ul>
          </div>
        ))}
      </div>
      <button className="btn-primary mt-4" onClick={() => { setShow(!show); sfx.reveal(); }}>{show ? "إخفاء الحل" : "أظهري الحل"}</button>
    </div>
  );
}

export default function Part7Enrich() {
  const [hl, setHl] = useState<number | null>(null);
  return (
    <div className="grid gap-8">
      <PartHeader n="07" title="المحاكاة والتجارب والأنشطة" lead="وراثة ما بعد مندل: ألوان ممزوجة.. بنت أم ولد.. وشجرة العائلة" />

      <Slide id="lab-generations" kicker="مختبر افتراضي" title="إجراء تجارب التزاوج عبر الأجيال">
        <GenerationsLab />
      </Slide>

      <Slide id="incomplete" kicker="إثراء" title="محاكاة إثرائية: أحمر × أبيض = وردي!"
        note="إثراء خارج الكتاب يكمل مثال نبات فم السمكة. ① تلقيح أحمر نقي × أبيض نقي. ② جميع الجيل الأول وردي: لا يسود أحد اللونين (سيادة غير تامة). ③ الجيل الثاني: أحمر : وردي : أبيض = 1 : 2 : 1.">
        <IncompleteDominanceLab />
      </Slide>

      <Slide id="sex" kicker="إثراء" title="محاكاة إثرائية: من يحدد جنس المولود؟"
        note="إثراء: كروموسومات الجنس. ① تظهر الخلايا الجنسية: بويضات الأم كلها X، والحيوانات المنوية X أو Y. ② تطير الحروف إلى مربع بانيت. ③ النتيجة: 50% بنات (XX) و50% أولاد (XY).">
        <SexDeterminationLab />
      </Slide>

      <Slide id="pedigree" kicker="إثراء" title="محاكاة إثرائية: مخطط السلالة يكشف السر"
        note="إثراء: مخطط السلالة يتتبع صفة في عائلة. ① أبوان لا تظهر عليهما الصفة. ② يظهر الأبناء، وابنة واحدة تظهر عليها الصفة (مظلّلة). ③ نكشف الجينات: الأبوان حاملان Aa، والابنة aa. هذا حل لغز بداية الدرس.">
        <PedigreeLab />
      </Slide>

      <Slide id="real" kicker="من واقع الحياة" title="ربط بالواقع: الوراثة تصنع العجائب!" note="اسألي قبل كل بطاقة: كيف يولد نمر أبيض لأبوين برتقاليين؟ لماذا تكون القطط ثلاثية الألوان إناثًا غالبًا؟ (صورة النمر الأبيض في استقصاء الكتاب ص136).">
        <p className="mb-4 text-white/70">اضغطي على علامة الاستفهام لكشف كل بطاقة</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{REAL.map((r) => <RealCard key={r.h} {...r} />)}</div>
      </Slide>

      <ThinkCard question="لماذا قد تظهر صفة متنحية في الأبناء مع أنها لا تظهر في الأبوين؟" answer={<>لأن كلا الأبوين غير متماثل الجينات (<G>Aa</G>) يحمل جينًا متنحيًا مختبئًا، فإذا ورث الابن الجينين المتنحيين (<G>aa</G>) ظهرت الصفة.</>} />

      <Slide id="dna3d" kicker="مختبر ثلاثي الأبعاد" title="نموذج DNA: دوّريه وكبّريه">
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="h-[420px] overflow-hidden rounded-3xl bg-gradient-to-b from-ink-700 to-ink-900 ring-1 ring-white/10 lg:col-span-2"><DnaHelix3D interactive highlight={hl} /></div>
          <div className="grid content-center gap-3">
            <p className="leading-8 text-white/80">الجين جزء من DNA يحمل معلومات صفة معيّنة. اسحبي لتدوير النموذج واستعملي التكبير، ثم ظلّلي «جينًا».</p>
            <button className="btn-primary" onClick={() => { setHl(Math.floor(Math.random() * 18) + 2); sfx.reveal(); }}>ظلّلي جينًا على DNA</button>
            <button className="btn-ghost" onClick={() => setHl(null)}>إزالة التظليل</button>
          </div>
        </div>
      </Slide>

      <Slide id="map" kicker="نموذج محلول" title="استراتيجية: خريطة مفاهيمية" note="نموذج محلول لاستراتيجية خريطة مفاهيمية. اضغطي لإظهار كل إجابة بعد مناقشتها مع الطالبات.">
        <ConceptMapSolved />
      </Slide>
      <Slide id="map-activity" kicker="نشاط بدون حل" title="خريطة مفاهيمية: اربطي المفاهيم" note="نسخة بدون حل: تملؤها المجموعات ثم تُقارن بالنموذج المحلول.">
        <SortActivity layout="map" buckets={MAP_SOLVED.map(([c]) => ({ id: c, title: c }))} items={MAP_SOLVED.map(([c, d]) => ({ id: d, text: d, bucket: c }))} />
      </Slide>
      <Slide id="venn" kicker="نموذج محلول" title="استراتيجية: شكل فن — متماثل وغير متماثل الجينات">
        <VennSolved />
      </Slide>
      <Slide id="venn-activity" kicker="نشاط بدون حل" title="شكل فن: صنّفي العبارات" note="نسخة بدون حل من استراتيجية شكل فن: تملؤها المجموعات ثم تُقارن بالنموذج المحلول.">
        <SortActivity
          buckets={[{ id: "homo", title: "متماثل الجينات", className: "bg-brand/15" }, { id: "both", title: "أوجه الشبه", className: "bg-accent/10" }, { id: "het", title: "غير متماثل الجينات", className: "bg-violet/15" }]}
          items={(Object.keys(VENN) as (keyof typeof VENN)[]).flatMap((k) => VENN[k].map((x) => ({ id: x, text: x, bucket: k })))}
        />
      </Slide>

      <Slide id="religion" kicker="ربط بالدين" title="تأمّل وتدبّر" note="اقرئي الآية، واسألي الطالبات: ما العلاقة بينها وبين درسنا؟ ثم اكشفي التأمل.">
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["﴿ وَأَنَّهُ خَلَقَ الزَّوْجَيْنِ الذَّكَرَ وَالْأُنثَىٰ ۝ مِن نُّطْفَةٍ إِذَا تُمْنَىٰ ﴾", "سورة النجم: 45–46", "من النطفة يتحدد الذكر والأنثى؛ والعلم يبيّن أن كروموسوم الأب يحدد جنس المولود."],
            ["﴿ يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ﴾", "سورة الحجرات: 13", "يرث كل إنسان صفاته من أب وأم، فيتنوع البشر شعوبًا وقبائل."],
            ["« وهذا عسى أن يكون نزعه عرق »", "رواه مسلم: في الرجل الذي وُلد له غلام يخالف لونه لون أبويه", "قد تظهر في الابن صفة من أجداده لا تظهر في أبويه: إشارة لانتقال الصفات عبر الأجيال."],
          ].map(([q, s, r]) => <ReflectCard key={s} q={q} s={s} r={r} />)}
        </div>
      </Slide>

      <Slide id="homeland" kicker="وطني يُلهمني" title="ربط بالوطن: المملكة وعلم الجينات">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["برنامج الجينوم السعودي", "يفك الشفرة الوراثية للمواطنين لبناء أول خارطة وراثية للمجتمع، ضمن رؤية 2030."],
            ["الفحص الطبي قبل الزواج", "يكشف حمل الأبوين لجينات أمراض مثل فقر الدم المنجلي والثلاسيميا."],
            ["الطب الشخصي", "علاج يناسب جينات كل مريض، من أهداف برنامج الجينوم (ص138 في الكتاب)."],
            ["زراعة البذور النقية", "يختار المزارعون بذورًا نقية لضمان صفات المحصول المرغوبة جيلًا بعد جيل."],
          ].map(([h, t], i) => (
            <motion.div key={h} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="rounded-3xl bg-gradient-to-br from-[#0F6B45] to-[#0A4A31] p-5 ring-1 ring-white/10">
              <h4 className="text-xl font-bold text-accent">{h}</h4><p className="mt-2 text-lg leading-8">{t}</p>
            </motion.div>
          ))}
        </div>
      </Slide>

      <Slide id="enrich" kicker="إثراء" title="إثراء وربط">
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["ربط مع الحياة: شبهك بعائلتك", "لون العيون والشعر والغمّازات صفات تنتقل إليك بالجينات."],
            ["إثراء: جينات ذبابة الفاكهة", "ابحثي في المواقع الموثوقة عن الجينات على كروموسومات ذبابة الفاكهة (من إثراء الكتاب)."],
            ["ربط مع الصحة: الأمراض الوراثية المتنحية", "مثل فقر الدم المنجلي: تظهر عند وراثة جينين متنحيين من أبوين حاملين."],
            ["ربط مع المهن: أخصائية الإرشاد الوراثي", "تقرأ مخططات السلالة وتشرح للأسر احتمالات انتقال الأمراض."],
          ].map(([h, t]) => <div key={h} className="card-cream p-5"><h4 className="text-lg font-bold text-brand-deep">{h}</h4><p className="mt-2 leading-8">{t}</p></div>)}
        </div>
      </Slide>
    </div>
  );
}

function ReflectCard({ q, s, r }: { q: string; s: string; r: string }) {
  const [o, setO] = useState(false);
  return (
    <div className="flex flex-col rounded-3xl bg-cream p-5 text-navy">
      <p className="text-xl font-bold leading-10 text-brand-deep">{q}</p>
      <p className="mt-1 text-sm text-navy/60">{s}</p>
      <div className="mt-auto pt-4">
        {o ? <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-2xl bg-brand/10 p-3 leading-7">{r}</motion.p> : <button className="btn-dark" onClick={() => { setO(true); sfx.reveal(); }}>اكشفي التأمل</button>}
      </div>
    </div>
  );
}
