import { useAuth } from "@/_core/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { profileInitials } from "@/lib/profileAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  useSidebar,
} from "@/components/ui/sidebar";
import { startLogin } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import { 
  Home, 
  Library, 
  Settings, 
  LogOut, 
  BookOpen, 
  BrainCircuit, 
  TrendingUp, 
  UserCircle,
  Menu,
  SquareStack,
  Bot,
  PanelLeft,
  Sparkles,
  Layers,
  Target
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from './DashboardLayoutSkeleton';
import { Button } from "./ui/button";
import { useTheme } from "../contexts/ThemeContext";

import { SpacesNavSection } from "./spaces/SpacesNavSection";
import { ActiveCoursesNav } from "./courses/ActiveCoursesNav";

const menuGroups = [
  {
    label: "STUDY STUDIO",
    items: [
      { icon: Home, label: "Home", path: "/" },
      { icon: Layers, label: "Artifact Studio", path: "/artifacts" },
      { icon: SquareStack, label: "Canvas Workspace", path: "/canvas" },
      { icon: Target, label: "Learning Plan", path: "/learning-plan" },
      { icon: BookOpen, label: "Library", path: "/library" },
    ]
  },
  {
    label: "LEARNING",
    items: [
      { icon: Bot, label: "Active Courses", path: "/learn" },
      { icon: TrendingUp, label: "Study Stats", path: "/stats" },
    ]
  },
  {
    label: "ACCOUNT",
    items: [
      { icon: UserCircle, label: "Profile", path: "/profile" },
      { icon: Sparkles, label: "Landing & Onboarding", path: "/landing" },
    ]
  }
];

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 280;
const MIN_WIDTH = 200;
const MAX_WIDTH = 480;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-2xl font-semibold tracking-tight text-center">
              Sign in to continue
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Access to this dashboard requires authentication. Continue to launch the login flow.
            </p>
          </div>
          <Button
            onClick={() => startLogin()}
            size="lg"
            className="w-full shadow-lg hover:shadow-xl transition-all"
          >
            Sign in
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const activeMenuItem = menuGroups.flatMap(g => g.items).find(item => item.path === location);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <>
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r-0 bg-[#1a1b1f] text-[#a0a3bd]"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-20 justify-center px-4 bg-[#1a1b1f]">
            <div className="flex items-center gap-3 transition-all w-full">
              <div className="w-8 h-8 rounded-full bg-[#c8f52c] flex items-center justify-center text-[#1a1b1f] font-bold shrink-0">
                <Sparkles className="h-4 w-4 fill-current" />
              </div>
              {!isCollapsed ? (
                <div className="flex flex-col min-w-0">
                  <span className="font-extrabold tracking-tight text-white text-lg leading-tight truncate">
                    learnloop
                  </span>
                  <span className="text-[10px] font-semibold text-[#8b8e9f] tracking-widest uppercase">
                    MAKE IT STICK
                  </span>
                </div>
              ) : null}
            </div>
          </SidebarHeader>

          <SidebarContent className="gap-2 py-4 px-3 bg-[#1a1b1f]">
            {!isCollapsed ? (
              <div className="flex flex-col gap-2">
                {/* Main Nav Items */}
                <button
                  onClick={() => setLocation("/")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all ${
                    location === "/"
                      ? "bg-white text-[#1a1b1f] shadow-sm"
                      : "text-[#9ca3af] hover:text-white hover:bg-[#25272e]"
                  }`}
                >
                  <Layers className="h-4 w-4 shrink-0" />
                  <span>My path</span>
                </button>


                <button
                  onClick={() => setLocation("/stats")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all ${
                    location === "/stats"
                      ? "bg-white text-[#1a1b1f] shadow-sm"
                      : "text-[#9ca3af] hover:text-white hover:bg-[#25272e]"
                  }`}
                >
                  <SquareStack className="h-4 w-4 shrink-0" />
                  <span>Mastery & badges</span>
                </button>

                <button
                  onClick={() => setLocation("/library")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all ${
                    location === "/library"
                      ? "bg-white text-[#1a1b1f] shadow-sm"
                      : "text-[#9ca3af] hover:text-white hover:bg-[#25272e]"
                  }`}
                >
                  <Library className="h-4 w-4 shrink-0" />
                  <span>Library</span>
                </button>

                <div className="my-2 border-t border-[#2a2c35]" />

                <button
                  onClick={() => setLocation("/artifacts")}
                  className={`flex items-center gap-3 px-4 py-3 rounded-full text-sm font-semibold transition-all ${
                    location === "/artifacts"
                      ? "bg-white text-[#1a1b1f] shadow-sm"
                      : "text-[#9ca3af] hover:text-white hover:bg-[#25272e]"
                  }`}
                >
                  <BookOpen className="h-4 w-4 shrink-0" />
                  <span>Artifact Studio</span>
                </button>

                <div className="my-2 border-t border-[#2a2c35]" />

                <SpacesNavSection />
                <ActiveCoursesNav />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4 pt-4">
                <button onClick={() => setLocation("/")} className="p-2 rounded-full hover:bg-[#25272e] text-white">
                  <Home className="h-5 w-5" />
                </button>
                <button onClick={() => setLocation("/library")} className="p-2 rounded-full hover:bg-[#25272e] text-[#9ca3af]">
                  <BookOpen className="h-5 w-5" />
                </button>
                <button onClick={() => setLocation("/canvas")} className="p-2 rounded-full hover:bg-[#25272e] text-[#9ca3af]">
                  <SquareStack className="h-5 w-5" />
                </button>
              </div>
            )}
          </SidebarContent>

          <SidebarFooter className="p-4 bg-[#1a1b1f]">
            {!isCollapsed && (
              <div className="bg-[#24262d] rounded-2xl p-4 mb-4 text-xs flex flex-col gap-2 border border-[#2e313a]">
                <div className="flex items-center justify-between text-[#9ca3af]">
                  <span>Daily focus</span>
                  <span className="font-semibold text-white">18 / 25 min</span>
                </div>
                <div className="w-full h-1.5 bg-[#1a1b1f] rounded-full overflow-hidden">
                  <div className="h-full bg-[#c8f52c] rounded-full" style={{ width: '72%' }} />
                </div>
                <div className="flex items-center gap-1.5 text-[#e5e7eb] font-semibold pt-1">
                  <Sparkles className="h-3.5 w-3.5 text-[#ff9800]" />
                  <span>6 day streak</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-[#9ca3af] px-1 mb-3">
              <span>Settings</span>
              <Settings className="h-4 w-4 cursor-pointer hover:text-white transition-colors" onClick={() => setLocation("/profile")} />
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-[#25272e] transition-colors w-full text-left focus:outline-none">
                  <Avatar className="h-8 w-8 border-none bg-[#f5d0ab] text-[#8b4513] shrink-0">
                    <AvatarImage src={user?.avatarUrl || undefined} alt="" />
                    <AvatarFallback className="text-xs font-bold">
                      {profileInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-semibold text-white truncate leading-none">
                      {user?.name || "Guest learner"}
                    </p>
                    <p className="text-xs text-[#717585] truncate mt-1">
                      Preview mode
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 bg-[#24262d] text-white border-[#2e313a]">
                {toggleTheme && (
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      toggleTheme();
                    }}
                    className="cursor-pointer hover:bg-[#2d3039]"
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Toggle Theme ({theme})</span>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  onClick={logout}
                  className="cursor-pointer text-red-400 focus:text-red-400 hover:bg-[#2d3039]"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""}`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
          style={{ zIndex: 50 }}
        />
      </div>

      <SidebarInset>
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="h-9 w-9 rounded-lg bg-background" />
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <span className="tracking-tight text-foreground">
                    {activeMenuItem?.label ?? "Menu"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        <main className="flex-1 p-4">{children}</main>
      </SidebarInset>
    </>
  );
}
