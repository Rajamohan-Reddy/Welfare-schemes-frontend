function SectionCard({ title, children }) {
  return (
    <div
      className="
        rounded-[30px]
        border
        border-slate-100
        bg-gradient-to-br
        from-white
        via-white
        to-slate-50
        p-6
        shadow-[0_10px_35px_rgba(15,23,42,0.05)]
      "
    >
      <div className="mb-5 flex items-center justify-between">
        <h2
          className="
            text-lg
            font-bold
            tracking-tight
            text-slate-900
          "
        >
          {title}
        </h2>

        <div
          className="
            h-1
            w-16
            rounded-full
            bg-gradient-to-r
            from-[#D4AF37]
            via-[#FCD34D]
            to-[#FFD95A]
          "
        />
      </div>

      {children}
    </div>
  );
}

export default SectionCard;
