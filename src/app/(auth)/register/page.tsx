"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Envelope, Lock, User, Eye, EyeSlash, Leaf } from "@phosphor-icons/react";
import { useLifeBalanceStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";

// Returns null to signal "show checkEmail screen" (prevents email enumeration).
function mapAuthError(msg: string, t: (key: string) => string): string | null {
  if (
    msg.includes("User already registered") ||
    msg.includes("email_address_not_authorized") ||
    msg.includes("already")
  ) {
    // Do NOT reveal "email taken" — silently show the same "check your inbox" screen
    return null;
  }
  if (msg.includes("Password should be at least") || msg.includes("weak_password")) {
    return t("auth.errorWeakPassword");
  }
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
    return t("auth.errorNetwork");
  }
  return msg;
}

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, hasCompletedOnboarding } = useLifeBalanceStore();
  const { t } = useT();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkEmail, setCheckEmail] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        await register(email, password, name || email.split("@")[0]);
        // Small delay to let onAuthStateChange fire and hydrate the store
        await new Promise((r) => setTimeout(r, 400));
        const state = useLifeBalanceStore.getState();
        if (state.isAuthenticated) {
          router.push(state.hasCompletedOnboarding ? "/dashboard" : "/onboarding");
        } else {
          // Email confirmation is enabled — show "check your email" screen
          setCheckEmail(true);
        }
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        const mapped = mapAuthError(msg, t);
        if (mapped === null) {
          // Don't reveal whether email exists — show the same "check inbox" screen
          setCheckEmail(true);
        } else {
          setError(mapped);
        }
      } finally {
        setLoading(false);
      }
    },
    [name, email, password, register, router, t]
  );

  useEffect(() => {
    if (isAuthenticated) {
      router.replace(hasCompletedOnboarding ? "/dashboard" : "/onboarding");
    }
  }, [isAuthenticated, hasCompletedOnboarding, router]);

  if (isAuthenticated) return null;

  if (checkEmail) {
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ width: "100%", maxWidth: 400, textAlign: "center" }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 20,
              background: "#C8DFC8",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 20px",
              boxShadow: "0 4px 16px rgba(122,174,122,0.3)",
            }}
          >
            <Envelope size={32} weight="fill" color="#7AAE7A" />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 12 }}>
            {t("auth.checkEmail")}
          </h2>
          <p style={{ color: "var(--text-secondary)", maxWidth: "none" }}>{email}</p>
        </motion.div>
      </div>
    );
  }

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
          top: -100,
          right: -60,
          width: 320,
          height: 320,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(212,197,226,0.4) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "fixed",
          bottom: -80,
          left: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(181,229,216,0.35) 0%, transparent 70%)",
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
            {t("auth.registerNow")}
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "none" }}>
            {t("auth.registerSubtitleFull")}
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                {t("auth.name")}
              </label>
              <div style={{ position: "relative" }}>
                <User size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  className="input"
                  type="text"
                  placeholder={t("auth.namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  style={{ paddingLeft: 40 }}
                  id="register-name"
                  autoComplete="name"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                {t("auth.email")}
              </label>
              <div style={{ position: "relative" }}>
                <Envelope size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: 40 }}
                  id="register-email"
                  autoComplete="email"
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                {t("auth.password")}
              </label>
              <div style={{ position: "relative" }}>
                <Lock size={16} color="var(--text-muted)" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  className="input"
                  type={showPwd ? "text" : "password"}
                  placeholder={t("auth.passwordPlaceholder")}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingLeft: 40, paddingRight: 44 }}
                  id="register-password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", padding: 4 }}
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
              style={{ width: "100%", justifyContent: "center", padding: "13px 20px", marginTop: 6, opacity: loading ? 0.7 : 1 }}
              id="register-submit"
            >
              {loading ? t("auth.loadingRegister") : t("auth.registerBtn")}
            </motion.button>
          </form>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "none" }}>
          {t("auth.haveAccount")}{" "}
          <Link href="/login" style={{ color: "#7AAE7A", fontWeight: 600, textDecoration: "none" }}>
            {t("auth.orLogin")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
