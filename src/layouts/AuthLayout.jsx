import { Outlet } from "react-router-dom";
import AuthHero from "../features/auth/components/AuthHero";

function AuthLayout() {
  return (
    <div className="h-screen overflow-hidden bg-[#F0F4FF]">
      <div className="grid h-screen lg:grid-cols-[56%_44%]">
        {/* Left — premium hero panel */}
        <AuthHero />

        {/* Right — form panel */}
        <div className="relative h-screen overflow-y-auto flex items-center justify-center px-8 py-10 bg-white">
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          {/* Faint radial glow in corners */}
          <div className="pointer-events-none absolute top-0 right-0 h-64 w-64 rounded-full bg-blue-50 blur-3xl opacity-60" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-50 blur-3xl opacity-40" />

          <div className="relative z-10 w-full flex justify-center">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
