import localFont from "next/font/local";

export const achiko = localFont({
  src: "../app/fonts/Achiko-Regular.otf",
  variable: "--font-achiko",
  display: "swap",
});

export const switzer = localFont({
  src: [
    {
      path: "../app/fonts/Switzer-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../app/fonts/Switzer-Medium.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../app/fonts/Switzer-Semibold.otf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../app/fonts/Switzer-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../app/fonts/Switzer-Extrabold.otf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-switzer",
  display: "swap",
});