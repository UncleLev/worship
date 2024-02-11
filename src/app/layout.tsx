import "@/shared/styles/global.scss";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
// import { Meta } from "./meta";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Worship",
        template: "%s | Worship",
    },
    description: "Міні пісеник",
    icons: "./favicon-32x32.png",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    );
}
