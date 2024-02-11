import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Worship",
        short_name: "Worship",
        description: "Міні пісеник",
        start_url: "/",
        display: "browser",
        background_color: "#fff",
        theme_color: "#fff",
        icons: [
            {
                src: "./favicon-16x16.png",
                sizes: "16x16",
                type: "image/png",
            },
            {
                src: "./favicon-32x32.png",
                sizes: "32x32",
                type: "image/png",
            },
            {
                src: "./favicon-144x144.png",
                sizes: "144x144",
                type: "image/png",
            },
            {
                src: "./favicon-192x192.png",
                sizes: "192x192",
                type: "image/png",
            },
            {
                src: "./favicon-3100x310.png",
                sizes: "310x310",
                type: "image/png",
            },
        ],
    };
}
