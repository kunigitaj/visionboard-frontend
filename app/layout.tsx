// app/layout.tsx

import { Provider } from "@/components/ui/provider"
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'VisionBoard',
  description: 'Track your goals simply and clearly.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}