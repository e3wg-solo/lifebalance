"use client";

import { getSector } from "@/lib/sectors";
import {
  Leaf,
  Barbell,
  HandHeart,
  Briefcase,
  PiggyBank,
  Palette,
  House,
  GlobeHemisphereWest,
} from "@phosphor-icons/react";
import type { IconWeight } from "@phosphor-icons/react";

interface SectorIconProps {
  sectorId: string;
  size?: number;
  color?: string;
  weight?: IconWeight;
  className?: string;
  style?: React.CSSProperties;
}

const SECTOR_ICON_MAP: Record<string, React.ComponentType<{ size?: number; color?: string; weight?: IconWeight; className?: string; style?: React.CSSProperties }>> = {
  health: Leaf,
  sport: Barbell,
  family: HandHeart,
  career: Briefcase,
  income: PiggyBank,
  hobbies: Palette,
  life: House,
  travel: GlobeHemisphereWest,
};

export function SectorIcon({
  sectorId,
  size = 24,
  color,
  weight = "regular",
  className,
  style,
}: SectorIconProps) {
  const sector = getSector(sectorId);
  const iconColor = color ?? sector?.colorDark ?? "currentColor";
  const Icon = SECTOR_ICON_MAP[sectorId];

  if (!Icon) {
    return (
      <span
        style={{ display: "inline-flex", width: size, height: size, alignItems: "center", justifyContent: "center", ...style }}
        className={className}
      >
        ?
      </span>
    );
  }

  return (
    <Icon
      size={size}
      color={iconColor}
      weight={weight}
      className={className}
      style={style}
    />
  );
}
