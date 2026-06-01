import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout() {
  return (
    <div
      className="
        h-screen
        overflow-hidden
        bg-[#F5F7FB]
      "
    >
      <Sidebar />

      <div
        className="
          ml-[92px]
          flex
          h-screen
          flex-col
          transition-all
          duration-300
        "
      >
        <Header />

        <main
          className="
            flex-1
            overflow-y-auto
            p-8
          "
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
