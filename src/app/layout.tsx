import "@/shared/styles/global.scss";
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import Head from "next/head";
// import { Meta } from "./meta";

const inter = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        default: "Worship",
        template: "%s | Worship",
    },
    description: "Міні пісеник",
    icons: "./favicon-32x32.png",
    // referrer: {
    // },
    themeColor: "#009688",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ua">
            {/* <Head>
                <title>sdfsdfsf</title>
                <meta name="theme-color" content="#009688" />
                <meta content="#009688" name="theme-color" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta
                    name="apple-mobile-web-app-status-bar-style"
                    content="black or black-translucent"
                />
                <meta content="yes" name="apple-mobile-web-app-capable" />
                <meta
                    content="black-translucent"
                    name="apple-mobile-web-app-status-bar-style"
                />
            </Head> */}
            <body className={inter.className}>{children}</body>
        </html>
    );
}
