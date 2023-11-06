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
    icons: {
        apple: "/icon.png",
        icon: "/icon.png",
    },
    themeColor: "#fff",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            {/* <Meta /> */}
            <body className={inter.className}>{children}</body>
        </html>
    );
}
