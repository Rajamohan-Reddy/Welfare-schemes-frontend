import { Outlet } from "react-router-dom";

import AuthHero from "../features/auth/components/AuthHero";

function AuthLayout() {
  return (
    <div className="h-screen overflow-hidden bg-slate-50">
      <div className="grid h-screen lg:grid-cols-[58%_42%]">
        <AuthHero />

        <div
          className="
            h-screen
            overflow-y-auto
            px-6
            py-4
            lg:px-8
          "
        >
          <div
            className="
              min-h-full
              flex
              items-center
              justify-center
            "
          >
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
