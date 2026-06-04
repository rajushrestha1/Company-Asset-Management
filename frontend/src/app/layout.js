import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "AssetFlow — Company Asset Management",
  description: "Manage, track and assign company hardware with ease.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}