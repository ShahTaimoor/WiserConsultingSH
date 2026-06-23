"use client";

import React, { useState, FormEvent, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetPassword } from "@/redux/slices/auth/authSlice";
import { motion } from "framer-motion";
import { Lock, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useAppDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loading, error, success } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const t = searchParams.get("token");
    if (!t) {
      setLocalError("Invalid or missing reset token. Please request a new reset link.");
    } else {
      setToken(t);
    }
  }, [searchParams]);

  // Redirect to login after success
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => router.push("/login"), 3000);
      return () => clearTimeout(timer);
    }
  }, [success, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match.");
      return;
    }

    if (!token) {
      setLocalError("Invalid reset token.");
      return;
    }

    dispatch(resetPassword({ token, password }));
  };

  // No token — show error state
  if (localError && !token) {
    return (
      <div className="text-center space-y-4 p-8">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Invalid Link</h2>
        <p className="text-sm text-slate-600">{localError}</p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors"
        >
          Request a new reset link
        </Link>
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4 p-8"
      >
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Password Reset!</h2>
        <p className="text-sm text-slate-600">{success}</p>
        <p className="text-xs text-slate-400">Redirecting to login in 3 seconds…</p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-900 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Go to Login
        </Link>
      </motion.div>
    );
  }

  return (
    <form className="p-8 space-y-6" onSubmit={handleSubmit}>
      {/* New Password */}
      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="text-sm font-semibold text-slate-700 flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          New Password
        </label>
        <div className="relative">
          <input
            id="new-password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            className="w-full px-4 py-3 pl-11 pr-16 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 transition-all"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm font-medium"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className="text-sm font-semibold text-slate-700 flex items-center gap-2"
        >
          <Lock className="w-4 h-4" />
          Confirm Password
        </label>
        <div className="relative">
          <input
            id="confirm-password"
            type={showPassword ? "text" : "password"}
            required
            className="w-full px-4 py-3 pl-11 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500 bg-white text-slate-900 placeholder-slate-400 transition-all"
            placeholder="Repeat your new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
        </div>
      </div>

      {/* Error Messages */}
      {(localError || error) && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 text-center">{localError || error}</p>
        </div>
      )}

      {/* Submit */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        type="submit"
        disabled={loading}
        id="reset-password-submit"
        className="w-full py-3.5 px-4 rounded-lg bg-slate-900 text-white font-semibold shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Resetting...
          </>
        ) : (
          <>
            <Lock className="w-5 h-5" />
            Reset Password
          </>
        )}
      </motion.button>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Login
        </Link>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8 sm:py-12">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-slate-900 px-8 py-8 text-center">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              Reset Password
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm">
              Enter your new password below
            </p>
          </div>

          <Suspense fallback={<div className="p-8 text-center text-slate-500 text-sm">Loading...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </motion.div>
      </div>
    </div>
  );
}
