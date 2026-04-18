"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Envelope, Lock, Eye, EyeSlash } from "@phosphor-icons/react";
import { useLifeBalanceStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";

function mapAuthError(msg: string, t: (key: string) => string): string {
  if (msg.includes("Invalid login credentials") || msg.includes("invalid_credentials")) {
    return t("auth.errorInvalid");
  }
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return t("auth.errorNetwork");
  }
  return msg;
}

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, hasCompletedOnboarding } = useLifeBalanceStore();
  const { t } = useT();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        await login(email, password);
        // onAuthStateChange → hydrateFromSupabase runs asynchronously;
        // wait briefly so store state is populated before redirect
        await new Promise((r) => setTimeout(r, 300));
        const state = useLifeBalanceStore.getState();
        router.push(state.hasCompletedOnboarding ? "/dashboard" : "/onboarding");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(mapAuthError(msg, t));
      } finally {
        setLoading(false);
      }
    },
    [email, password, login, router, t]
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(hasCompletedOnboarding ? "/dashboard" : "/onboarding");
    }
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  if (isAuthenticated) return null;

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
      <div
        style={{
          position: "fixed",
          bottom: -100,
          right: -80,
          width: 300,
          height: 300,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(253,220,181,0.35) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 26 }}
        style={{ width: "100%", maxWidth: 400 }}
      >
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "#F7F8E9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 4px 16px rgba(122,174,122,0.2)",
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/icons/logo.svg" alt="" width={49} height={49} />
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 6 }}>
            LifeBalance
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "none" }}>
            {t("auth.loginSubtitleFull")}
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                {t("auth.email")}
              </label>
              <div style={{ position: "relative" }}>
                <Envelope
                  size={16}
                  color="var(--text-muted)"
                  style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: 40 }}
                  id="login-email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)" }}>
                  {t("auth.password")}
                </label>
                <Link
                  href="/forgot-password"
                  style={{ fontSize: "0.8125rem", fontWeight: 600, color: "#7AAE7A", textDecoration: "none" }}
                >
                  {t("auth.forgotPassword")}
                </Link>
              </div>
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
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  id="login-password"
                  autoComplete="current-password"
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
              id="login-submit"
            >
              {loading ? t("auth.loadingLogin") : t("auth.loginBtn")}
            </motion.button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "none" }}>
          {t("auth.noAccount")}{" "}
          <Link
            href="/register"
            style={{ color: "#7AAE7A", fontWeight: 600, textDecoration: "none" }}
          >
            {t("auth.orRegister")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
