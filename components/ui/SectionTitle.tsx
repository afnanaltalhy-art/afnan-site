export default function SectionTitle({ kicker, title, lead, center = false }: { kicker?: string; title: string; lead?: string; center?: boolean }) {
  return (
    <div className={`mb-10 ${center ? "text-center" : ""}`}>
      {kicker && <span className="chip mb-3">{kicker}</span>}
      <h2 className="h-section">{title}</h2>
      {lead && <p className={`mt-3 max-w-2xl leading-8 text-white/70 ${center ? "mx-auto" : ""}`}>{lead}</p>}
    </div>
  );
}
