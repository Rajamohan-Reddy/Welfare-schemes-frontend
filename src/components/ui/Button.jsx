import { Loader2 } from "lucide-react";

function Button({
  children,
  type = "button",
  loading = false,
  fullWidth = true,
  variant = "primary",
  className = "",
  ...props
}) {
  const variants = {
    primary:
      "bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-lg shadow-sky-500/20 hover:from-blue-700 hover:to-sky-700",

    secondary:
      "bg-white border border-slate-200 text-slate-900 shadow-sm hover:bg-slate-100",

    success: "bg-emerald-600 text-white shadow-sm hover:bg-emerald-700",
  };

  return (
    <button
      type={type}
      disabled={loading}
      className={`
        h-12
        rounded-2xl
        px-6
        font-medium
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-60
        ${fullWidth ? "w-full" : "inline-flex"}
        items-center justify-center
        ${variants[variant]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 size={18} className="animate-spin" />
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
