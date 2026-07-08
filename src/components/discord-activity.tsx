"use client";

import { useEffect, useState } from "react";
import type { PortfolioConfigInput } from "@/lib/portfolio-config";

type DiscordActivityConfig = PortfolioConfigInput["discordActivity"];

const API_BASE = "https://grux.audibert.dev";
const POLL_INTERVAL_MS = 10000;

const STATUS_COLORS: Record<string, string> = {
  online: "#23a55a",
  idle: "#f0b232",
  dnd: "#f23f43",
  offline: "#80848e",
};

type DiscordActivity = {
  type: string;
  name: string;
  details?: string;
  state?: string;
  largeImage?: string;
  largeText?: string;
};

type DiscordSpotify = {
  song: string;
  artist: string;
  album_image?: string;
  link: string;
};

type DiscordActivityData = {
  status: string;
  spotify?: DiscordSpotify;
  activity?: DiscordActivity[];
};

function useDiscordActivity(config: DiscordActivityConfig) {
  const [data, setData] = useState<DiscordActivityData | null>(null);
  const enabled = config?.enabled ?? false;
  const userId = config?.userId;

  useEffect(() => {
    if (!enabled || !userId) {
      setData(null);
      return;
    }

    let cancelled = false;

    async function fetchActivity() {
      try {
        const res = await fetch(`${API_BASE}/activity/${userId}`);
        const json = await res.json();
        if (!cancelled && json?.success) setData(json.data);
      } catch {
        // Discord activity is a nice-to-have, fail silently.
      }
    }

    fetchActivity();
    const interval = setInterval(fetchActivity, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [enabled, userId]);

  return data;
}

export function DiscordStatusDot({ config }: { config: DiscordActivityConfig }) {
  const data = useDiscordActivity(config);
  if (!data) return null;

  const color = STATUS_COLORS[data.status] ?? STATUS_COLORS.offline;

  return (
    <span className="relative inline-flex h-2.5 w-2.5 shrink-0 self-center" style={{ transform: "translateY(-3px)" }} title={`Discord: ${data.status}`}>
      <span
        className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75"
        style={{ backgroundColor: color }}
      />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />
    </span>
  );
}

function ActivityCardImage({ image, alt }: { image?: string; alt: string }) {
  if (!image) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt={alt} className="aspect-square h-14 shrink-0 rounded-md object-cover" />
  );
}

export function DiscordActivitySection({ config, title }: { config: DiscordActivityConfig; title: string }) {
  const data = useDiscordActivity(config);
  if (!data) return null;

  const activities = (data.activity ?? []).filter((a) => a.type === "Playing");
  if (!data.spotify && activities.length === 0) return null;

  const cardClassName = "rounded-lg border flex h-full items-center gap-x-3 overflow-hidden p-3";
  const cardStyle = { backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))" };

  return (
    <section className="flex min-h-0 flex-col gap-y-3 print:hidden">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {data.spotify && (
          <a
            href={data.spotify.link}
            target="_blank"
            rel="noopener noreferrer"
            className={cardClassName}
            style={{ ...cardStyle, textDecoration: "none", color: "inherit" }}
          >
            <ActivityCardImage image={data.spotify.album_image} alt={data.spotify.song} />
            <div className="min-w-0 flex-1">
              <p className="font-mono text-xs opacity-60" style={{ color: "hsl(var(--muted-foreground))" }}>Listening to Spotify</p>
              <p className="truncate font-semibold tracking-tight text-sm">{data.spotify.song}</p>
              <p className="truncate font-mono text-xs" style={{ color: "hsl(var(--foreground) / 0.8)" }}>{data.spotify.artist}</p>
            </div>
          </a>
        )}
        {activities.map((activity, i) => {
          const detailLine =
            activity.name === "Visual Studio Code"
              ? activity.details ?? "In game session"
              : [activity.details, activity.state].filter(Boolean).join(" · ") || "In game session";
          return (
            <div key={i} className={cardClassName} style={cardStyle}>
              <ActivityCardImage image={activity.largeImage} alt={activity.largeText ?? activity.name} />
              <div className="min-w-0 flex-1">
                <p className="font-mono text-xs opacity-60" style={{ color: "hsl(var(--muted-foreground))" }}>Playing</p>
                <p className="truncate font-semibold tracking-tight text-sm">{activity.name}</p>
                <p className="truncate font-mono text-xs" style={{ color: "hsl(var(--foreground) / 0.8)" }}>{detailLine}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
