"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { Envelope, Lock, Eye, EyeSlash, Leaf } from "@phosphor-icons/react";
import { useLifeBalanceStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const login = useLifeBalanceStore((s) => s.login);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      if (!email.includes("@")) {
        setError("Введите корректный email");
        return;
      }
      if (password.length < 6) {
        setError("Пароль должен быть от 6 символов");
        return;
      }
      setLoading(true);
      // Mock auth — 600ms delay
      await new Promise((r) => setTimeout(r, 600));
      login(email);
      router.push("/dashboard");
    },
    [email, password, login, router]
  );

  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      {/* Decorative blobs */}
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
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
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
            LifeBalance
          </h1>
          <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "none" }}>
            Войди, чтобы продолжить свой путь
          </p>
        </div>

        {/* Card */}
        <div
          className="card"
          style={{ padding: 28 }}
        >
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                Email
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

            {/* Password */}
            <div>
              <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
                Пароль
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
                  aria-label={showPwd ? "Скрыть" : "Показать"}
                >
                  {showPwd ? <EyeSlash size={16} color="var(--text-muted)" /> : <Eye size={16} color="var(--text-muted)" />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontSize: "0.8125rem",
                  color: "#D97070",
                  background: "#FFF0F0",
                  borderRadius: 8,
                  padding: "8px 12px",
                  maxWidth: "none",
                }}
              >
                {error}
              </motion.p>
            )}

            {/* Submit */}
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
              {loading ? "Входим..." : "Войти"}
            </motion.button>
          </form>
        </div>

        {/* Footer */}
        <p style={{ textAlign: "center", marginTop: 20, fontSize: "0.875rem", color: "var(--text-secondary)", maxWidth: "none" }}>
          Нет аккаунта?{" "}
          <Link
            href="/register"
            style={{ color: "#7AAE7A", fontWeight: 600, textDecoration: "none" }}
          >
            Зарегистрироваться
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
