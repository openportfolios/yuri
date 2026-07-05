import { ImageResponse } from "next/og";
import { portfolioConfig } from "@/lib/portfolio-config";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  const iconUrl = portfolioConfig.meta.favicon || portfolioConfig.person.avatar;

  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={iconUrl}
          width={32}
          height={32}
          style={{ objectFit: "cover" }}
          alt=""
        />
      </div>
    ),
    { ...size }
  );
}
