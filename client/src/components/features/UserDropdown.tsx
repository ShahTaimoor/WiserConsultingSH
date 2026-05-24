"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { ChevronDown, User, LogOut } from "lucide-react";
import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/slices/auth/authSlice";
import type { User as UserType } from "@/types";

interface UserDropdownProps {
  user: UserType;
}

export function UserDropdown({ user }: UserDropdownProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/");
  };

  const isAdmin = user.role === 1;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400/30"
        aria-label="User menu"
        aria-expanded={open}
      >
        <div className="w-7 h-7 bg-slate-900 rounded-full flex items-center justify-center">
          <span className="text-white text-[10px] font-semibold">{user.name?.charAt(0).toUpperCase()}</span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} aria-hidden />
          <div className="absolute right-0 mt-2 w-56 z-20 bg-white rounded-2xl border border-slate-200 shadow-xl py-1 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name || "User"}</p>
              <p className="text-xs text-slate-500 mt-0.5 truncate">{user.email || ""}</p>
            </div>
            <div className="py-1">
              {isAdmin && (
                <Link href="/admin" onClick={() => setOpen(false)}
                  className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-green-50 hover:text-green-700 transition-colors"
                >
                  <span className="mr-3 w-2 h-2 rounded-full bg-green-600" />
                  <span>Admin</span>
                </Link>
              )}
              <button onClick={() => setOpen(false)}
                className="w-full flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <User className="mr-3 h-4 w-4" />
                <span>Profile</span>
              </button>
            </div>
            <div className="border-t border-slate-100 py-1">
              <button onClick={() => { setOpen(false); handleLogout(); }}
                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
