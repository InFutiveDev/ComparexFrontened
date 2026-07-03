import Script from "next/script";
import { AuthProvider } from "@/components/auth/auth-provider";
import { StripExtensionAttrs } from "@/components/strip-extension-attrs";
import { stripExtensionScript } from "@/lib/strip-extension-attrs";
import "./globals.css";

export const metadata = {
  title: "Comparex",
  description: "Comparex is a platform that helps you compare products and services.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full bg-slate-50 text-slate-900" suppressHydrationWarning>
        <Script
          id="strip-extension-attrs"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: stripExtensionScript }}
        />
        <StripExtensionAttrs />
        <AuthProvider>
          <div className="contents" suppressHydrationWarning>
            {children}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
