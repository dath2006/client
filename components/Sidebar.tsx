"use client";

import React, { useState, useEffect } from "react";
import {
  PanelRightOpen,
  PanelLeftClose,
  ChevronDown,
  ChevronRight,
  Settings,
  LayoutGrid,
  PackagePlus,
} from "lucide-react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";

interface NavItem {
  name: string;
  subitems?: string[];
}

const navItems: NavItem[] = [
  {
    name: "Manage",
    subitems: ["Posts", "Pages", "Users", "Groups", "Uploads", "Tags"],
  },
  {
    name: "Settings",
    subitems: [
      "General",
      "Content",
      "Usersettings",
      "Comments",
      "Routes",
      "Sitemap",
      "ReadMore",
      "Likes",
      "Cascade",
      "Lightbox",
      "SyntaxHighlighting",
      "MathJax",
    ],
  },
  {
    name: "Extend",
    subitems: ["Modules", "Feathers", "Themes"],
  },
];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const router = useRouter();
  const pathname = usePathname();

  // Get current active section from pathname
  const getCurrentSection = () => {
    const pathParts = pathname.split("/");
    return pathParts[2]; // /admin/[section]
  };

  const currentSection = getCurrentSection();

  // Auto-expand the parent category based on current route
  useEffect(() => {
    if (currentSection) {
      // Find which parent category contains the current section
      navItems.forEach((item) => {
        if (
          item.subitems?.some(
            (subitem) =>
              subitem.toLowerCase() === currentSection ||
              (subitem.toLowerCase() === "users" &&
                currentSection === "usersettings")
          )
        ) {
          if (!expandedItems.includes(item.name)) {
            setExpandedItems((prev) => [...prev, item.name]);
          }
        }
      });
    }
  }, [currentSection]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleItem = (itemName: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemName)
        ? prev.filter((item) => item !== itemName)
        : [...prev, itemName]
    );
  };

  const handleSubItemClick = (subItem: string) => {
    const sectionName =
      subItem.toLowerCase() === "users" &&
      navItems.find(
        (item) => item.subitems?.includes("Users") && item.name === "Settings"
      )
        ? "usersettings"
        : subItem.toLowerCase();

    router.push(`/admin/${sectionName}`);
    // Keep the dropdown open - don't modify expandedItems
  };

  const isSubItemActive = (subItem: string) => {
    const sectionName =
      subItem.toLowerCase() === "users" &&
      navItems.find(
        (item) => item.subitems?.includes("Users") && item.name === "Settings"
      )
        ? "usersettings"
        : subItem.toLowerCase();

    return currentSection === sectionName;
  };

  return (
    <div
      className={`sidebar-gradient h-screen flex flex-col transition-all duration-300 rounded-r-lg shadow-lg
      ${isOpen ? "w-64" : "w-20"} relative`}
    >
      <button
        onClick={toggleSidebar}
        className="absolute right-4 top-4 text-white hover:text-accent transition-colors z-10"
      >
        {isOpen ? <PanelLeftClose size={24} /> : <PanelRightOpen size={24} />}
      </button>

      <div className="text-white text-2xl font-bold p-4 pt-16 flex-shrink-0">
        {isOpen ? "CMS Admin" : <LayoutGrid size={24} />}
      </div>

      <nav className="flex-1 overflow-y-auto mt-8 pb-4">
        {navItems.map((item) => (
          <div key={item.name} className="mb-2">
            <button
              onClick={() => toggleItem(item.name)}
              className={`w-full text-left p-4 flex items-center justify-between
              text-white hover:bg-white/10 transition-colors rounded-lg mx-2
              ${expandedItems.includes(item.name) ? "bg-white/10" : ""}`}
            >
              <span className="flex items-center">
                {!isOpen ? (
                  item.name === "Manage" ? (
                    <LayoutGrid size={20} />
                  ) : item.name === "Settings" ? (
                    <Settings size={20} />
                  ) : (
                    <PackagePlus size={20} />
                  )
                ) : (
                  item.name
                )}
              </span>
              {isOpen &&
                (expandedItems.includes(item.name) ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                ))}
            </button>

            {isOpen && expandedItems.includes(item.name) && (
              <div className="ml-4 border-l-2 border-accent/30">
                {item.subitems?.map((subitem) => (
                  <button
                    key={subitem}
                    onClick={() => handleSubItemClick(subitem)}
                    className={`w-full text-left p-2 pl-4 transition-colors text-sm rounded-r-lg
                    ${
                      isSubItemActive(subitem)
                        ? "text-white bg-white/20 border-r-2 border-accent"
                        : "text-white/80 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {subitem}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
