import { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, icon: Icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            className="
              mb-2
              block
              text-sm
              font-medium
              text-slate-700
            "
          >
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <Icon
              size={18}
              className="
                absolute
                left-4
                top-1/2
                -translate-y-1/2
                text-slate-400
              "
            />
          )}

          <input
            ref={ref}
            className={`
              h-12
              w-full
              rounded-2xl
              border
              border-slate-200
              bg-white
              px-4
              outline-none
              transition
              focus:border-[#1E3A8A]

              ${Icon ? "pl-11" : ""}

              ${className}
            `}
            {...props}
          />
        </div>

        {error && (
          <p
            className="
              mt-1
              text-xs
              text-red-500
            "
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";

export default Input;
