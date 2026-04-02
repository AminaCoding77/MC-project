"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface SidebarProps {
  userRole: "student" | "teacher";
}

const Sidebar: React.FC<SidebarProps> = ({ userRole }) => {
  const router = useRouter();
  const [active, setActive] = useState<string>("dashboard");
  const [isOpen, setIsOpen] = useState(false);

  const links =
    userRole === "student"
      ? [
          { name: "Dashboard", key: "dashboard", route: "/student/dashboard" },
          { name: "Courses", key: "courses", route: "/student/courses" },
          {
            name: "Assignments",
            key: "assignments",
            route: "/student/assignments",
          },
          { name: "Profile", key: "profile", route: "/student/profile" },
        ]
      : [
          { name: "Dashboard", key: "dashboard", route: "/teacher/dashboard" },
          {
            name: "Assignments",
            key: "assignments",
            route: "/teacher/assignments",
          },
          { name: "Students", key: "students", route: "/teacher/students" },
          { name: "Profile", key: "profile", route: "/teacher/profile" },
        ];

  const handleNavigate = (route: string, key: string) => {
    setActive(key);
    setIsOpen(false); // close mobile menu
    router.push(route);
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-[#0d0f14]/80 p-2 rounded-lg shadow-lg text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen z-40
          bg-[#0d0f14]/90 backdrop-blur-xl border-r border-white/[0.06] text-white
          flex flex-col p-6 shadow-2xl
          w-64
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:flex
        `}
      >
        <div className="text-2xl font-bold mb-8 text-center tracking-wide text-white/90">
          {userRole === "student" ? "Student Portal" : "Teacher Portal"}
        </div>

        <nav className="flex flex-col gap-3">
          {links.map((link) => (
            <button
              key={link.key}
              onClick={() => handleNavigate(link.route, link.key)}
              className={`
                text-left px-4 py-3 rounded-xl transition-all duration-200
                hover:bg-blue-500/20
                ${active === link.key ? "bg-blue-500/10 font-semibold" : "text-gray-300"}
              `}
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              router.push("/login");
            }}
            className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/30 transition-all duration-200 font-medium mt-4"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
