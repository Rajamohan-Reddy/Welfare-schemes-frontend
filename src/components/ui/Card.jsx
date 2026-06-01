function Card({ children, className = "" }) {
  return (
    <div
      className={`
        w-full
        rounded-[28px]
        border
        border-slate-200
        bg-white
        p-8
        shadow-[0_20px_50px_rgba(15,23,42,0.08)]
        ${className}
      `}
    >
      {children}
    </div>
  );
}

export default Card;
