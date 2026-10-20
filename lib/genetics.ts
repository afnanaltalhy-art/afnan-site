export type Trait = {
  key: string;
  name: string;
  D: string; // dominant letter
  r: string; // recessive letter
  domName: string;
  recName: string;
  domColor: string;
  recColor: string;
  domImg?: string;
  recImg?: string;
};

export const TRAITS: Trait[] = [
  { key: "pod", name: "لون قرون البازلاء", D: "G", r: "g", domName: "خضراء", recName: "صفراء", domColor: "#2FA36B", recColor: "#E7B416", domImg: "/lessons/genetics/pod-green.jpg", recImg: "/lessons/genetics/pod-yellow.jpg" },
  { key: "height", name: "طول ساق البازلاء", D: "T", r: "t", domName: "طويلة", recName: "قصيرة", domColor: "#14917F", recColor: "#6D4FC2" },
  { key: "seed", name: "شكل بذور البازلاء", D: "R", r: "r", domName: "ملساء", recName: "مجعّدة", domColor: "#7CB342", recColor: "#9E8F3A", domImg: "/lessons/genetics/seed-green-round.jpg", recImg: "/lessons/genetics/seed-wrinkled.jpg" },
  { key: "seedColor", name: "لون بذور البازلاء", D: "Y", r: "y", domName: "صفراء", recName: "خضراء", domColor: "#E7B416", recColor: "#5DAA3A", domImg: "/lessons/genetics/seed-yellow.jpg", recImg: "/lessons/genetics/seed-green-round.jpg" },
  { key: "flower", name: "لون أزهار البازلاء", D: "P", r: "p", domName: "أرجوانية", recName: "بيضاء", domColor: "#8E5BD0", recColor: "#C9C3B8", domImg: "/lessons/genetics/flower-purple.jpg", recImg: "/lessons/genetics/flower-white.jpg" },
  { key: "dimples", name: "الغمّازات عند الإنسان", D: "D", r: "d", domName: "لديه غمّازات", recName: "بدون غمّازات", domColor: "#F08A24", recColor: "#8A9AA3" },
  { key: "cat", name: "لون شعر القطط", D: "B", r: "b", domName: "أسود", recName: "أشقر", domColor: "#2B2B33", recColor: "#E3B65A" },
];

export const isCap = (c: string) => c !== c.toLowerCase();
export const norm = (a: string, b: string) => (isCap(b) && !isCap(a) ? b + a : a + b);

export function genotypes(t: Trait) {
  return [t.D + t.D, t.D + t.r, t.r + t.r];
}

export function cross(p1: string, p2: string) {
  // p1 letters across the top, p2 letters down the side
  const cells: { r: number; c: number; top: string; side: string; g: string }[] = [];
  for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) cells.push({ r, c, top: p1[c], side: p2[r], g: norm(p2[r], p1[c]) });
  const counts: Record<string, number> = {};
  cells.forEach((x) => (counts[x.g] = (counts[x.g] ?? 0) + 1));
  const dom = cells.filter((x) => isCap(x.g[0])).length;
  return { cells, counts, dom, rec: 4 - dom };
}

export function describeGenotype(g: string) {
  return g[0] === g[1] ? "متماثل الجينات (نقي)" : "غير متماثل الجينات (هجين)";
}

export function ratioText(counts: Record<string, number>, t: Trait) {
  return genotypes(t).filter((g) => counts[g]).map((g) => `${counts[g]} ${g}`).join(" : ");
}
