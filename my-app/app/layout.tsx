import type { Metadata } from "next";
import "./globals.css";
import ErrorBoundary from "../components/ErrorBoundary";



export const metadata: Metadata = {
  title: "Smart Recipe Analyzer",
  description:
    "Transform your available ingredients into delicious recipes with detailed nutritional analysis powered by AI",
  keywords: [
    "recipes",
    "cooking",
    "AI",
    "nutrition",
    "ingredients",
    "meal planning",
  ],
  authors: [{ name: "Smart Recipe Analyzer" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#3b82f6",
};

function EnvironmentCheck({ children }: { children: React.ReactNode }) {
  // Check if API URL is configured
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (typeof window !== "undefined" && !apiUrl) {
    console.warn(
      "NEXT_PUBLIC_API_URL is not configured. Using default: http://localhost:8000"
    );
  }

  return <>{children}</>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <ErrorBoundary>
          <EnvironmentCheck>{children}</EnvironmentCheck>
        </ErrorBoundary>
      </body>
    </html>
  );
}
