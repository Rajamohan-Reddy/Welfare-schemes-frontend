import { motion } from "framer-motion";
import { Landmark, ShieldCheck, FileText, Users } from "lucide-react";

import Logo from "../../../assets/images/ap-logo.png";

function AuthHero() {
  const stats = [
    {
      icon: FileText,
      value: "250+",
      label: "Schemes",
    },
    {
      icon: Users,
      value: "12L+",
      label: "Citizens",
    },
    {
      icon: Landmark,
      value: "24×7",
      label: "Services",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Secure",
    },
  ];

  return (
    <div
      className="
        relative
        hidden
        lg:flex
        flex-col
        overflow-hidden
        bg-gradient-to-br
        from-[#071A45]
        via-[#0B2E78]
        to-[#2563EB]
        px-10
        py-8
        text-white
      "
    >
      <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />

      <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />

      <div className="relative z-10 flex items-center gap-4">
        <div
          className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-white
            shadow-xl
          "
        >
          <img
            src={Logo}
            alt="AP Government"
            className="h-12 w-12 object-contain"
          />
        </div>

        <div>
          <h2 className="text-xl font-bold">Government of Andhra Pradesh</h2>

          <p className="text-sm text-blue-100">Welfare Services Portal</p>
        </div>
      </div>

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
        }}
        className="
          flex-1
          flex
          flex-col
          justify-center
          py-6
        "
      >
        <div
          className="
            inline-flex
            w-fit
            rounded-full
            border
            border-white/15
            bg-white/10
            px-4
            py-2
            text-[11px]
            font-semibold
            tracking-[0.15em]
            backdrop-blur-md
          "
        >
          DIGITAL GOVERNANCE PLATFORM
        </div>

        <h1
          className="
            mt-5
            max-w-lg
            text-4xl
            font-bold
            leading-tight
          "
        >
          One Portal for
          <span className="block text-blue-200">Every Welfare Service</span>
        </h1>

        <p
          className="
            mt-4
            max-w-xl
            text-base
            leading-7
            text-blue-100
          "
        >
          Apply for welfare schemes, upload documents, track approvals and
          receive government benefits through a single secure platform.
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/10
              p-3
              backdrop-blur-xl
            "
          >
            <div
              className="
                mb-2
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-lg
                bg-white/15
              "
            >
              <item.icon size={16} />
            </div>

            <h3 className="text-lg font-bold">{item.value}</h3>

            <p className="text-xs text-blue-100">{item.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AuthHero;
