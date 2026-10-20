import { prisma, safe } from "./db";
import { BUILTIN_PORTFOLIO, GENETICS_LESSON, GENETICS_QUIZ } from "./builtin";
import type { LessonCard, PortfolioCard, QuizCard, QuizQuestion } from "./types";

export async function getLessons(includeDrafts = false): Promise<LessonCard[]> {
  const rows = await safe(
    () => prisma.lesson.findMany({ where: includeDrafts ? {} : { published: true }, orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    [],
  );
  const list: LessonCard[] = rows.map((r) => ({ ...r }));
  if (!list.some((l) => l.slug === GENETICS_LESSON.slug)) list.unshift(GENETICS_LESSON);
  return list;
}

export async function getLesson(slug: string) {
  return safe(() => prisma.lesson.findUnique({ where: { slug }, include: { files: { orderBy: { createdAt: "asc" } } } }), null);
}

function toQuiz(r: { id: string; title: string; description: string | null; lessonSlug: string | null; secondsPerQuestion: number; questions: unknown }): QuizCard {
  return { ...r, questions: (Array.isArray(r.questions) ? r.questions : []) as QuizQuestion[] };
}

export async function getQuizzes(): Promise<QuizCard[]> {
  const rows = await safe(() => prisma.quiz.findMany({ where: { published: true }, orderBy: { createdAt: "desc" } }), []);
  return [GENETICS_QUIZ, ...rows.map(toQuiz)];
}

export async function getQuiz(id: string): Promise<QuizCard | null> {
  if (id === GENETICS_QUIZ.id) return GENETICS_QUIZ;
  const r = await safe(() => prisma.quiz.findUnique({ where: { id } }), null);
  return r ? toQuiz(r) : null;
}

export async function getPortfolio(): Promise<PortfolioCard[]> {
  const rows = await safe(() => prisma.portfolioItem.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }), []);
  return rows.length ? rows : BUILTIN_PORTFOLIO;
}
