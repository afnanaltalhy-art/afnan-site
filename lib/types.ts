export type QuizQuestion = { q: string; options: string[]; answer: number; explain?: string };
export type LessonSection = { title: string; body: string };

export type LessonCard = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string | null;
  subject?: string | null;
  grade?: string | null;
  description?: string | null;
  coverUrl?: string | null;
  interactive: boolean;
  published?: boolean;
  order?: number;
};

export type QuizCard = {
  id: string;
  title: string;
  description?: string | null;
  lessonSlug?: string | null;
  secondsPerQuestion: number;
  questions: QuizQuestion[];
  builtin?: boolean;
};

export type PortfolioCard = {
  id: string;
  title: string;
  description?: string | null;
  category?: string | null;
  imageUrl?: string | null;
  link?: string | null;
};
