"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useLifeBalanceStore } from "@/lib/store";
import { useT } from "@/lib/i18n/useT";
import type { Language } from "@/types";
import {
  Moon,
  Sun,
  DeviceMobile,
  Bell,
  SignOut,
  Translate,
  Vibrate,
} from "@phosphor-icons/react";

type Theme = "light" | "dark" | "system";

export default function SettingsPage() {
  const router = useRouter();
  const { t } = useT();
  const { user, logout, updateUser } = useLifeBalanceStore();
  const [name, setName] = useState(user?.name ?? "");
  const [saved, setSaved] = useState(false);

  const theme = user?.preferences?.theme ?? "system";
  const language: Language = user?.preferences?.language ?? "system";
  const haptics = user?.preferences?.haptics ?? true;
  const notifications = user?.preferences?.notifications ?? true;

  const THEME_OPTIONS: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: t("settings.themeLight"), icon: <Sun size={16} weight="fill" /> },
    { value: "dark", label: t("settings.themeDark"), icon: <Moon size={16} weight="fill" /> },
    { value: "system", label: t("settings.themeSystem"), icon: <DeviceMobile size={16} weight="fill" /> },
  ];

  const LANG_OPTIONS: { value: Language; label: string }[] = [
    { value: "ru", label: t("settings.langRu") },
    { value: "en", label: t("settings.langEn") },
    { value: "system", label: t("settings.langSystem") },
  ];

  const handleThemeChange = (t: Theme) => {
    updateUser({ preferences: { ...user!.preferences, theme: t } });
  };

  const handleLanguageChange = (lang: Language) => {
    updateUser({ preferences: { ...user!.preferences, language: lang } });
  };

  const handleNotificationsToggle = () => {
    updateUser({
      preferences: {
        ...user!.preferences,
        notifications: !notifications,
      },
    });
  };

  const handleHapticsToggle = () => {
    updateUser({
      preferences: {
        ...user!.preferences,
        haptics: !haptics,
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

  const handleRequestNotifications = async () => {
    if (typeof Notification !== "undefined" && Notification.permission === "default") {
      await Notification.requestPermission();
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: "0 0 24px" }}>
      {/* Header */}
      <div style={{ padding: "24px 16px 24px" }}>
        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: 4 }}>
          {t("settings.title")}
        </h1>
        <p style={{ fontSize: "0.9375rem", color: "var(--text-secondary)", maxWidth: "none" }}>
          {t("settings.subtitle")}
        </p>
      </div>

      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 16 }}>
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
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <img src="/icons/logo.svg" alt="LifeBalance" width={56} height={56} style={{ display: "block", width: 56, height: 56 }} />
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

          <div>
            <label style={{ display: "block", fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-secondary)", marginBottom: 6 }}>
              {t("settings.nameLabel")}
            </label>
            <div style={{ display: "flex", gap: 8 }}>
              <input
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("settings.namePlaceholder")}
                style={{ flex: 1 }}
                id="settings-name"
              />
              <motion.button
                className="btn btn-accent"
                whileTap={{ scale: 0.96 }}
                onClick={handleSaveName}
                style={{ flexShrink: 0 }}
              >
                {saved ? "✓" : t("common.save")}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="card"
          style={{ padding: 20 }}
        >
          <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", marginBottom: 12, maxWidth: "none" }}>
            {t("settings.theme")}
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

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="card"
          style={{ padding: 20 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <Translate size={16} weight="fill" color="var(--chip-blue-text)" />
            <p style={{ fontSize: "0.875rem", fontWeight: 700, color: "var(--text-primary)", maxWidth: "none" }}>
              {t("settings.language")}
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
            {LANG_OPTIONS.map(({ value, label }) => (
              <motion.button
                key={value}
                whileTap={{ scale: 0.94 }}
                onClick={() => handleLanguageChange(value)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 6,
                  padding: "12px 8px",
                  borderRadius: 12,
                  border: `2px solid ${language === value ? "var(--chip-blue-text)" : "var(--border)"}`,
                  background: language === value ? "var(--chip-blue-bg)" : "var(--surface)",
                  cursor: "pointer",
                  fontSize: "0.8125rem",
                  fontWeight: 600,
                  color: language === value ? "var(--chip-blue-text)" : "var(--text-secondary)",
                  transition: "all 0.2s",
                }}
                id={`lang-${value}`}
              >
                {label}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Notifications + Haptics */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.11 }}
          className="card"
          style={{ padding: 20, display: "flex", flexDirection: "column", gap: 16 }}
        >
          <SettingsRow
            icon={<Bell size={18} weight={notifications ? "fill" : "regular"} color="var(--chip-blue-text)" />}
            label={t("settings.notifications")}
            description={t("settings.notificationsHint")}
            right={
              <Toggle
                checked={notifications}
                onToggle={handleNotificationsToggle}
                id="notifications-toggle"
                activeColor="#7AAE7A"
              />
            }
          />

          {typeof Notification !== "undefined" && Notification.permission === "default" && notifications && (
            <button
              onClick={handleRequestNotifications}
              className="btn btn-accent"
              style={{ fontSize: "0.8125rem", alignSelf: "flex-start" }}
            >
              {t("settings.requestNotifications")}
            </button>
          )}

          <div style={{ height: 1, background: "var(--border)" }} />

          <SettingsRow
            icon={<Vibrate size={18} weight={haptics ? "fill" : "regular"} color="var(--chip-orange-text)" />}
            label={t("settings.haptics")}
            description={t("settings.hapticsHint")}
            right={
              <Toggle
                checked={haptics}
                onToggle={handleHapticsToggle}
                id="haptics-toggle"
                activeColor="#E09040"
              />
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
            {t("settings.stats")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ background: "var(--chip-green-bg)", borderRadius: 12, padding: "12px 14px" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--chip-green-text)", maxWidth: "none" }}>
                {useLifeBalanceStore.getState().cycles.length}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500, maxWidth: "none" }}>
                {t("settings.statsCycles")}
              </p>
            </div>
            <div style={{ background: "var(--chip-orange-bg)", borderRadius: 12, padding: "12px 14px" }}>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--chip-orange-text)", maxWidth: "none" }}>
                {useLifeBalanceStore.getState().getWeekStreak()}
              </p>
              <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500, maxWidth: "none" }}>
                {t("settings.statsDays")}
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
            {t("settings.logout")}
          </span>
        </motion.button>
      </div>
    </div>
  );
}

function Toggle({
  checked,
  onToggle,
  id,
  activeColor = "#7AAE7A",
}: {
  checked: boolean;
  onToggle: () => void;
  id: string;
  activeColor?: string;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={onToggle}
      style={{
        width: 46,
        height: 26,
        borderRadius: 13,
        background: checked ? activeColor : "var(--border-strong)",
        border: "none",
        cursor: "pointer",
        position: "relative",
        transition: "background 0.25s",
        flexShrink: 0,
      }}
      id={id}
      aria-label={id}
      role="switch"
      aria-checked={checked}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
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
