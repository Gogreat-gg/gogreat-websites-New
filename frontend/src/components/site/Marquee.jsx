// Slow editorial marquee (pure CSS animation, duplicated track)
export const Marquee = ({ items, dark = false }) => {
  const track = [...items, ...items];
  return (
    <div
      data-testid="editorial-marquee"
      className={`relative flex overflow-hidden border-y ${
        dark ? "border-white/15 bg-[#0B132B] text-white" : "border-[#E5E5E5] bg-white text-[#0A0A0A]"
      }`}
    >
      <div className="flex shrink-0 animate-marquee whitespace-nowrap py-5">
        {track.map((item, i) => (
          <span key={i} className="mx-8 flex items-center gap-8 text-sm font-medium uppercase tracking-widest">
            {item}
            <span className="text-[#0033FF]">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};
