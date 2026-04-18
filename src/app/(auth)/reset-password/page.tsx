"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Lock, Eye, EyeSlash, Leaf, ArrowLeft, CheckCircle, Warning } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n/useT";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { t } = useT();

  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validSession, setValidSession] = useState<boolean | null>(null);

  // Supabase redirects to /reset-password with tokens in the URL fragment:
  // #access_token=…&refresh_token=…&type=recovery
  // We exchange them for a session, then wipe the hash to prevent token leakage
  // in browser history / referrer headers.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      setValidSession(false);
      return;
    }

    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || !refreshToken || type !== "recovery") {
      setValidSession(false);
      return;
    }

    // Exchange tokens for a session
    supabase.auth
      .setSession({ access_token: accessToken, refresh_token: refreshToken })
      .then(({ error: err }) => {
        if (err) {
          setValidSession(false);
        } else {
          setValidSession(true);
          // Wipe hash from URL so the token never leaks to history/referrer
          history.replaceState(null, "", window.location.pathname);
        }
      });
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        const { error: err } = await supabase.auth.updateUser({ password });
        if (err) throw err;
        setDone(true);
        // Redirect to dashboard after a short delay
        setTimeout(() => router.replace("/dashboard"), 2000);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Password should be at least") || msg.includes("weak_password")) {
          setError(t("auth.errorWeakPassword"));
        } else if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
          setError(t("auth.errorNetwork"));
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    },
    [password, router, t]
  );

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          position: "fixed",
          top: -120,
          left: -80,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(200,223,200,0.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "#C8DFC8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 16px rgba(122,174,122,0.3)",
            }}
          >
            <Leaf size={32} weight="fill" color="#7AAE7A" />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            {t("auth.resetPasswordTitle")}
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "none" }}>
            {t("auth.resetPasswordSubtitle")}
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {/* Invalid / expired link */}
          {validSession === false && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "8px 0" }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "rgba(224,83,83,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <Warning size={24} weight="fill" color="#E05353" />
              </div>
              <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9375rem", maxWidth: "none", marginBottom: 16 }}>
                {t("auth.resetPasswordInvalidLink")}
              </p>
              <Link
                href="/forgot-password"
                style={{ color: "#7AAE7A", fontWeight: 600, textDecoration: "none", fontSize: "0.875rem" }}
              >
                {t("auth.forgotPasswordBtn")}
              </Link>
            </motion.div>
          )}

          {/* Success state */}
          {done && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center", padding: "8px 0" }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: "50%",
                  background: "var(--chip-green-bg)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                }}
              >
                <CheckCircle size={24} weight="fill" color="#7AAE7A" />
              </div>
              <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9375rem", maxWidth: "none" }}>
                {t("auth.resetPasswordSuccess")}
              </p>
            </motion.div>
          )}

          {/* Loading / waiting for session exchange */}
          {validSession === null && !done && (
            <p style={{ textAlign: "center", color: "var(--text-muted)", fontSize: "0.9375rem", padding: "16px 0", maxWidth: "none" }}>
              {t("common.loading")}
            </p>
          )}

          {/* Password form */}
          {validSession === true && !done && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                  {t("auth.password")}
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={16}
                    color="var(--text-muted)"
                    style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    className="input"
                    type={showPwd ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={8}
                    style={{ paddingLeft: 40, paddingRight: 44 }}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd((v) => !v)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 4,
                    }}
                    aria-label={showPwd ? t("auth.hidePassword") : t("auth.showPassword")}
                  >
                    {showPwd ? <EyeSlash size={16} color="var(--text-muted)" /> : <Eye size={16} color="var(--text-muted)" />}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  style={{
                    fontSize: "0.8125rem",
                    color: "#E05353",
                    background: "rgba(224,83,83,0.08)",
                    borderRadius: 8,
                    padding: "8px 12px",
                    margin: 0,
                    maxWidth: "none",
                  }}
                >
                  {error}
                </p>
              )}

              <motion.button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
                whileTap={{ scale: 0.97 }}
                style={{
                  width: "100%",
                  justifyContent: "center",
                  padding: "13px 20px",
                  marginTop: 4,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? t("auth.resetPasswordLoading") : t("auth.resetPasswordBtn")}
              </motion.button>
            </form>
          )}
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.875rem", maxWidth: "none" }}>
          <Link
            href="/login"
            style={{ color: "#7AAE7A", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 4 }}
          >
            <ArrowLeft size={14} />
            {t("auth.backToLogin")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
