import type { LessonCard, PortfolioCard, QuizCard } from "./types";

export const GENETICS_LESSON: LessonCard = {
  id: "builtin-genetics",
  slug: "genetics",
  title: "علم الوراثة",
  subtitle: "كيف تنتقل الصفات من الآباء إلى الأبناء؟",
  subject: "العلوم",
  grade: "ثالث متوسط",
  description: "الوحدة الثانية: أسس الحياة • الفصل الرابع: الوراثة — درس تفاعلي كامل بالمحاكاة ومربع بانيت والمختبر ثلاثي الأبعاد والمسابقات.",
  coverUrl: "/lessons/genetics/pea-illustration.jpg",
  interactive: true,
  published: true,
  order: 0,
};

export const GENETICS_QUIZ: QuizCard = {
  id: "genetics-stars",
  title: "مسابقة نجمات العلوم: علم الوراثة",
  description: "الجولة الثالثة (الموسم الثاني) — أسئلة الدرس وتدريبات نافس.",
  lessonSlug: "genetics",
  secondsPerQuestion: 40,
  builtin: true,
  questions: [
    { q: "يُلقّب بمؤسس علم الوراثة:", options: ["داروين", "مندل", "نيوتن", "باستير"], answer: 1, explain: "مندل أول من تتبّع صفة واحدة عبر أجيال واستعمل الاحتمالات." },
    { q: "أجرى مندل تجاربه الشهيرة على نبات:", options: ["القمح", "البازلاء", "فم السمكة", "الذرة"], answer: 1 },
    { q: "الصفة التي تختفي في الجيل الأول تسمى صفة:", options: ["سائدة", "متنحية", "نقية", "شكلية"], answer: 1 },
    { q: "نسبة الصفة السائدة إلى المتنحية في الجيل الثاني عند مندل:", options: ["1 : 1", "2 : 1", "3 : 1", "4 : 0"], answer: 2 },
    { q: "النبات ذو الطراز الجيني Tt يوصف بأنه:", options: ["متماثل الجينات", "غير متماثل الجينات (هجين)", "قصير الساق", "نقي"], answer: 1 },
    { q: "اللون الأحمر لأزهار نبات فم السمكة مثال على:", options: ["الطرز الجينية", "الطرز الشكلية", "الجين المتنحي", "مربع بانيت"], answer: 1 },
    { q: "الذي يحدد جنس المولود هو كروموسوم:", options: ["الأم (X)", "الأب (X أو Y)", "الجد", "لا شيء مما سبق"], answer: 1, explain: "بويضات الأم كلها X، أما الحيوانات المنوية فنصفها X ونصفها Y." },
    { q: "لُقّح نبات بازلاء طويل نقي (TT) مع نبات قصير (tt). ما الطراز الجيني لجميع الأبناء؟", options: ["TT", "Tt", "tt", "نصفها TT ونصفها tt"], answer: 1 },
    { q: "الصفات المظهرية للمخلوق الحي الناتجة عن جيناته تسمى:", options: ["الطرز الشكلية", "الطرز الجينية", "الجينات المتقابلة", "الصفات المتنحية"], answer: 0 },
    { q: "في تزاوج Bb × bb، احتمال ظهور الصفة المتنحية في الأبناء:", options: ["0%", "25%", "50%", "100%"], answer: 2 },
    { q: "تنفصل الجينات المتقابلة بعضها عن بعض في أثناء:", options: ["الانقسام المتساوي", "الانقسام المنصّف", "تضاعف DNA", "بناء البروتين"], answer: 1 },
    { q: "ما احتمال ظهور نبات قصير (tt) من تزاوج Tt × Tt؟", options: ["0%", "25%", "50%", "75%"], answer: 1, explain: "TT : Tt : tt = 1 : 2 : 1، أي ¼ = 25%." },
  ],
};

export const BUILTIN_PORTFOLIO: PortfolioCard[] = [
  { id: "pf-genetics", title: "درس علم الوراثة التفاعلي", description: "تحويل عرض من 56 شريحة إلى تجربة رقمية: محاكاة، مربع بانيت تفاعلي، مختبر ثلاثي الأبعاد ومسابقة.", category: "درس تفاعلي", imageUrl: "/lessons/genetics/pea-illustration.jpg", link: "/lessons/genetics" },
  { id: "pf-labs", title: "مختبرات الوراثة الافتراضية", description: "مختبر التزاوج عبر الأجيال، ومربع بانيت، وتحديد الجنس، والسيادة غير التامة.", category: "محاكاة", imageUrl: "/lessons/genetics/pod-green.jpg", link: "/labs" },
  { id: "pf-stars", title: "مسابقة نجمات العلوم", description: "نظام مسابقات للمجموعات بالمؤقت والنقاط ولوحة الترتيب والاحتفال.", category: "لعبة تعليمية", imageUrl: "/lessons/genetics/flower-purple.jpg", link: "/games" },
];
