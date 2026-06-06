import { Geist, Geist_Mono } from "next/font/google";

import { StripExtensionAttrs } from "@/components/strip-extension-attrs";
import "./globals.css";

const EXTENSION_ATTRS = [
  "bis_skin_checked",
  "bis_register",
  "bis_id",
  "cz-shortcut-listen",
  "data-new-gr-c-s-check-loaded",
  "data-gr-ext-installed",
];

const stripExtensionScript = `
(function () {
  var attrs = ${JSON.stringify(EXTENSION_ATTRS)};
  var shouldStrip = function (name) {
    if (!name) return false;
    if (attrs.indexOf(name) !== -1) return true;
    return name.indexOf("__processed_") === 0;
  };
  var strip = function () {
    try {
      var nodes = document.querySelectorAll("*");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        for (var j = el.attributes.length - 1; j >= 0; j--) {
          var attr = el.attributes[j];
          if (shouldStrip(attr.name)) el.removeAttribute(attr.name);
        }
      }
    } catch (e) {}
  };
  strip();
  new MutationObserver(function (records) {
    for (var i = 0; i < records.length; i++) {
      var record = records[i];
      if (record.type === "attributes" && shouldStrip(record.attributeName)) {
        record.target.removeAttribute(record.attributeName);
      }
    }
    strip();
  }).observe(document.documentElement, { attributes: true, subtree: true });
})();
`;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Comparex",
  description: "Comparex is a platform that helps you compare products and services.",
};

export default function RootLayout({
  children,
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full bg-slate-50 text-slate-900"
        suppressHydrationWarning
      >
        <script
          dangerouslySetInnerHTML={{ __html: stripExtensionScript }}
        />
        <StripExtensionAttrs />
        <div className="contents" suppressHydrationWarning>
          {children}
        </div>
      </body>
    </html>
  );
}
