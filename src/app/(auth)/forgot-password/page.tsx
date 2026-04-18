"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Envelope, Leaf, ArrowLeft } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { useT } from "@/lib/i18n/useT";

export default function ForgotPasswordPage() {
  const { t } = useT();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setLoading(true);
      try {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (err) throw err;
        setSent(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) {
          setError(t("auth.errorNetwork"));
        } else {
          setError(msg);
        }
      } finally {
        setLoading(false);
      }
    },
    [email, t]
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
            {t("auth.forgotPasswordTitle")}
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "none" }}>
            {t("auth.forgotPasswordSubtitle")}
          </p>
        </div>

        <div className="card" style={{ padding: 28 }}>
          {sent ? (
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
                <Envelope size={24} weight="fill" color="#7AAE7A" />
              </div>
              <p style={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.9375rem", maxWidth: "none" }}>
                {t("auth.forgotPasswordSent")}
              </p>
            </motion.div>
          ) : (
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
                    autoComplete="email"
                  />
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
                {loading ? t("auth.forgotPasswordLoading") : t("auth.forgotPasswordBtn")}
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
