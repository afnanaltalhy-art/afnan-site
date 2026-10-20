/**
 * Renders the plain-text export of a Google Doc as written,
 * giving vision / mission / goals blocks a distinguished treatment.
 */
const SPECIAL = /^(الرؤية|رؤيتي|الرسالة|رسالتي|الأهداف|أهدافي|الأهداف العامة|فلسفتي|فلسفتي التعليمية|التعريف|نبذة|السيرة الذاتية)\s*[:：]?\s*$/;

type Block = { type: "h" | "p" | "li"; text: string } | { type: "special"; title: string; lines: string[] };

function parse(text: string): Block[] {
  const lines = text.replace(/\r/g, "").replace(/^﻿/, "").split("\n").map((l) => l.trim());
  const blocks: Block[] = [];
  let special: { type: "special"; title: string; lines: string[] } | null = null;
  for (const line of lines) {
    if (!line) continue;
    const head = line.replace(/[:：]\s*$/, "");
    const inline = line.match(/^(الرؤية|رؤيتي|الرسالة|رسالتي)\s*[:：]\s*(.+)$/);
    if (SPECIAL.test(line)) {
      special = { type: "special", title: head, lines: [] };
      blocks.push(special);
      continue;
    }
    if (inline) {
      blocks.push({ type: "special", title: inline[1], lines: [inline[2]] });
      special = null;
      continue;
    }
    const bullet = line.match(/^([*•●▪\-–]|[\d٠-٩]+[.)-])\s*(.+)$/);
    const isHeading = !bullet && line.length <= 48 && !/[.،؛!؟]$/.test(line) && /[:：]$|^[^\s]+(\s[^\s]+){0,5}$/.test(line);
    if (special && !isHeading) {
      special.lines.push(bullet ? bullet[2] : line);
      continue;
    }
    special = null;
    if (bullet) blocks.push({ type: "li", text: bullet[2] });
    else if (isHeading) blocks.push({ type: "h", text: head });
    else blocks.push({ type: "p", text: line });
  }
  return blocks;
}

export default function DocText({ text }: { text: string }) {
  const blocks = parse(text);
  return (
    <div className="measure space-y-4 text-[17px] leading-[2] text-navy-700">
      {blocks.map((b, i) => {
        if (b.type === "special")
          return (
            <aside key={i} className="relative my-8 rounded-3xl border border-gold/30 bg-gradient-to-bl from-gold-50 to-white p-7">
              <h3 className="mb-3 text-[20px] font-extrabold text-gold-700">{b.title}</h3>
              {b.lines.length > 1 ? (
                <ul className="list-disc space-y-2 pr-5 marker:text-gold-500">
                  {b.lines.map((l, j) => (
                    <li key={j}>{l}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-[19px] leading-[2] text-navy">{b.lines[0]}</p>
              )}
            </aside>
          );
        if (b.type === "h") return <h3 key={i} className="pt-4 text-[21px] font-extrabold text-navy">{b.text}</h3>;
        if (b.type === "li")
          return (
            <p key={i} className="relative pr-6 before:absolute before:right-0 before:top-[.95em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-gold-500">
              {b.text}
            </p>
          );
        return <p key={i}>{b.text}</p>;
      })}
    </div>
  );
}
