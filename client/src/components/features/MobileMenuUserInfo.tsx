import { useCallback } from "react";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { logout } from "@/redux/slices/auth/authSlice";
import { useRouter } from "next/navigation";
import type { User } from "@/types";

interface MobileMenuUserInfoProps {
  user: User;
  onClose: () => void;
}

export function MobileMenuUserInfo({ user, onClose }: MobileMenuUserInfoProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const isAdmin = user.role === 1;

  const handleLogout = useCallback(() => {
    dispatch(logout());
    router.push("/");
    onClose();
  }, [dispatch, router, onClose]);

  return (
    <div className="pt-4 border-t border-slate-200 space-y-3">
      {isAdmin && (
        <Link
          href="/admin"
          onClick={onClose}
          className="block px-4 py-3 text-base font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors text-center"
        >
          Admin Dashboard
        </Link>
      )}
      <div className="flex items-center space-x-3 px-4 py-3 bg-slate-50 rounded-lg">
        <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center shrink-0">
          <span className="text-white text-sm font-semibold">
            {user.name?.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-slate-900 truncate">
            {user.name}
          </div>
          <div className="text-xs text-slate-600 truncate">{user.email}</div>
        </div>
      </div>
      <button
        onClick={handleLogout}
        className="w-full px-4 py-3 text-base font-semibold rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
