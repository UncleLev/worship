import "@/shared/styles/global.scss";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Worship",
        template: "%s | Worship",
    },
    description: "Міні пісеник",
    icons: "/favicon-32x32.png",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ua">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
