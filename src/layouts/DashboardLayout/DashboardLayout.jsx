import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

function DashboardLayout() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="
        h-screen
        overflow-hidden
        bg-[#F5F7FB]
      "
    >
      <Sidebar expanded={expanded} setExpanded={setExpanded} />

      <div
        className={`
          flex
          h-screen
          flex-col
          transition-all
          duration-300
          ${expanded ? "ml-64" : "ml-20"}
        `}
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
