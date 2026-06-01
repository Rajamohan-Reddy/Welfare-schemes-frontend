import { Search } from "lucide-react";

function SchemeSearchBar({ value, onChange }) {
  const quickTags = [
    "Pension",
    "Farmer",
    "Scholarship",
    "Housing",
    "Women Welfare",
  ];

  return (
    <div>
      <div className="relative">
        <Search
          size={20}
          className="
            absolute
            left-4
            top-1/2
            -translate-y-1/2
            text-slate-400
          "
        />

        <input
          value={value}
          onChange={onChange}
          placeholder="Search welfare schemes, pensions, scholarships..."
          className="
            h-14
            w-full
            rounded-2xl
            border
            border-white/20
            bg-white
            pl-12
            pr-4
            text-slate-900
            shadow-lg
            outline-none
          "
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickTags.map((tag) => (
          <button
            key={tag}
            className="
              rounded-full
              bg-white/15
              px-3
              py-1
              text-xs
              font-medium
              text-white
              backdrop-blur-sm
            "
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SchemeSearchBar;
