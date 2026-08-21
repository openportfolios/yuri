"use client";

import { useEffect, useState } from "react";
import type { PortfolioConfigInput } from "@/lib/portfolio-config";

type DiscordActivityConfig = PortfolioConfigInput["discordActivity"];

const WS_BASE = "wss://grux.audibert.dev";
const RECONNECT_BASE_MS = 1000;
const RECONNECT_MAX_MS = 30000;
const IDLE_CLOSE_MS = 5000;

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

type GruxMessage = {
  op: "initial_data" | "presence_update";
  d: DiscordActivityData;
};

type Listener = (data: DiscordActivityData | null) => void;

type Connection = {
  socket: WebSocket | null;
  listeners: Set<Listener>;
  data: DiscordActivityData | null;
  attempts: number;
  reconnectTimer: ReturnType<typeof setTimeout> | null;
  idleTimer: ReturnType<typeof setTimeout> | null;
};

// One socket per user id, shared by every component that renders the activity.
const connections = new Map<string, Connection>();

function connect(userId: string, conn: Connection) {
  const socket = new WebSocket(`${WS_BASE}?user_id=${encodeURIComponent(userId)}`);
  conn.socket = socket;

  socket.onopen = () => {
    conn.attempts = 0;
  };

  socket.onmessage = (event) => {
    try {
      const message: GruxMessage = JSON.parse(event.data);
      if (message.op !== "initial_data" && message.op !== "presence_update") return;
      conn.data = {
        status: message.d.status,
        spotify: message.d.spotify,
        activity: message.d.activity,
      };
      conn.listeners.forEach((listener) => listener(conn.data));
    } catch {
      // Discord activity is a nice-to-have, fail silently.
    }
  };

  socket.onclose = () => {
    conn.socket = null;
    if (conn.listeners.size === 0) return;
    const delay = Math.min(RECONNECT_BASE_MS * 2 ** conn.attempts, RECONNECT_MAX_MS);
    conn.attempts += 1;
    conn.reconnectTimer = setTimeout(() => connect(userId, conn), delay);
  };

  socket.onerror = () => socket.close();
}

function subscribe(userId: string, listener: Listener) {
  let conn = connections.get(userId);
  if (!conn) {
    conn = { socket: null, listeners: new Set(), data: null, attempts: 0, reconnectTimer: null, idleTimer: null };
    connections.set(userId, conn);
  }

  if (conn.idleTimer) {
    clearTimeout(conn.idleTimer);
    conn.idleTimer = null;
  }

  conn.listeners.add(listener);
  if (conn.data) listener(conn.data);
  if (!conn.socket && !conn.reconnectTimer) connect(userId, conn);

  return () => {
    const current = connections.get(userId);
    if (!current) return;
    current.listeners.delete(listener);
    if (current.listeners.size > 0) return;
    // Grace period so remounts (and React strict mode) do not churn the socket.
    current.idleTimer = setTimeout(() => {
      if (current.listeners.size > 0) return;
      if (current.reconnectTimer) clearTimeout(current.reconnectTimer);
      current.socket?.close();
      connections.delete(userId);
    }, IDLE_CLOSE_MS);
  };
}

function useDiscordActivity(config: DiscordActivityConfig) {
  const [data, setData] = useState<DiscordActivityData | null>(null);
  const enabled = config?.enabled ?? false;
  const userId = config?.userId;

  useEffect(() => {
    if (!enabled || !userId) {
      setData(null);
      return;
    }
    return subscribe(userId, setData);
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
  const cardStyle = { borderColor: "hsl(var(--border))" };

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
