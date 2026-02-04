import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PAM Techno Client Progress Tracker",
    short_name: "PAM Tracker",
    description:
      "Pantau progres proyek digital Anda secara real-time bersama PAM Techno.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#ffffff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/logo-pure.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo-pure.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
