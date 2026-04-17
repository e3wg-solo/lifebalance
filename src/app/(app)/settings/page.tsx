"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLifeBalanceStore } from "@/lib/store";
import {
  Moon,
  Sun,
  DeviceMobile,
  Bell,
  SignOut,
  Leaf,
} from "@phosphor-icons/react";

type Theme = "light" | "dark" | "system";

const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
  { value: "light", label: "Светлая", icon: <Sun size={16} weight="fill" /> },
  { value: "dark", label: "Тёмная", icon: <Moon size={16} weight="fill" /> },
  { value: "system", label: "Системная", icon: <DeviceMobile size={16} weight="fill" /> },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user, logout, updateUser } = useLifeBalanceStore();
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);

  const theme = user?.preferences?.theme ?? "system";

  const handleThemeChange = (t: Theme) => {
    updateUser({ preferences: { ...user!.preferences, theme: t } });
  };

  const handleNotificationsToggle = () => {
    updateUser({
      preferences: {
        ...user!.preferences,
        notifications: !user?.preferences?.notifications,
      },
    });
  };

  const handleSaveName = () => {
    updateUser({ name });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  if (!user) return null;

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* Header */}
      <div
        style={{
          padding: "56px 24px 24px",
          background: "linear-gradient(180deg, rgba(212,197,226,0.2) 0%, transparent 100%)",
        }}
      >
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
          Настройки
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "none" }}>
          Аккаунт и предпочтения
        </p>
      </div>

      <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card"
          style={{ padding: 20 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 18,
                background: "var(--health)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Leaf size={28} weight="fill" color="#7AAE7A" />
            </div>
            <div>
              <p style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)", maxWidth: "none" }}>
                {user.name}
              </p>
              <p style={{ fontSize: "0.8125rem", color: "var(--text-muted)", maxWidth: "none" }}>
                {user.email}
              </p>
            </div>
          </div>

          {/* Name field */}
          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              Имя
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Как тебя зовут?"
                style={{ flex: 1 }}
                id="settings-name"
              />
              <motion.button
                className="btn btn-accent"
                whileTap={{ scale: 0.96 }}
                onClick={handleSaveName}
                style={{ flexShrink: 0 }}
              >
                {saved ? "✓" : "Сохранить"}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="card"
          style={{ padding: 20 }}
        >
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, maxWidth: "none" }}>
            Тема оформления
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {THEME_OPTIONS.map(({ value, label, icon }) => (
              <motion.button
                key={value}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleThemeChange(value)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 8px",
                  borderRadius: 12,
                  border: `2px solid ${theme === value ? "var(--accent)" : "var(--border)"}`,
                  background: theme === value ? "var(--chip-green-bg)" : "var(--surface)",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: theme === value ? "var(--accent)" : "var(--text-secondary)",
                  transition: "all 0.2s",
                }}
                id={`theme-${value}`}
              >
                {icon}
                {label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
          style={{ padding: 20 }}
        >
          <SettingsRow
            icon={<Bell size={18} weight={user.preferences?.notifications ? "fill" : "regular"} color="var(--chip-blue-text)" />}
            label="Напоминания"
            description="Уведомление о новом цикле через 30 дней"
            right={
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={handleNotificationsToggle}
                style={{
                  width: 46,
                  height: 26,
                  borderRadius: 13,
                  background: user.preferences?.notifications ? "#7AAE7A" : "rgba(0,0,0,0.12)",
                  border: "none",
                  cursor: "pointer",
                  position: "relative",
                  transition: "background 0.25s",
                  flexShrink: 0,
                }}
                id="notifications-toggle"
                aria-label="Переключить уведомления"
              >
                <motion.div
                  animate={{ x: user.preferences?.notifications ? 22 : 2 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  style={{
                    position: "absolute",
                    top: 3,
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "white",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                  }}
                />
              </motion.button>
            }
          />
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.14 }}
          className="card"
          style={{ padding: 20 }}
        >
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 14, maxWidth: "none" }}>
            Статистика
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "var(--chip-green-bg)", borderRadius: 12, padding: "12px 14px" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--chip-green-text)", maxWidth: "none" }}>
                {useLifeBalanceStore.getState().cycles.length}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500, maxWidth: "none" }}>
                Циклов
              </p>
            </div>
            <div style={{ background: "var(--chip-orange-bg)", borderRadius: 12, padding: "12px 14px" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--chip-orange-text)", maxWidth: "none" }}>
                {user.streakDays ?? 0}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500, maxWidth: "none" }}>
                Дней подряд
              </p>
            </div>
          </div>
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.18 }}
          className="card"
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: 20,
            cursor: "pointer",
            border: "1px solid rgba(217, 112, 112, 0.25)",
            background: "rgba(245,197,197,0.1)",
            width: "100%",
            textAlign: "left",
          }}
          id="logout-btn"
        >
          <SignOut size={20} weight="regular" color="#D97070" />
          <span style={{ fontSize: "0.9375rem", fontWeight: 600, color: "#D97070" }}>
            Выйти из аккаунта
          </span>
        </motion.button>
      </div>
    </div>
  );
}

function SettingsRow({
  icon,
  label,
  description,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  description?: string;
  right?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--surface-hover)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text-primary)", maxWidth: "none" }}>
          {label}
        </p>
        {description && (
          <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: 1, maxWidth: "none" }}>
            {description}
          </p>
        )}
      </div>
      {right}
    </div>
  );
}
