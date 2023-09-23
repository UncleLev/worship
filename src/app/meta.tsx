export const Meta = () => {
    return (
        <>
            <meta name="application-name" content="PWA App" />

            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta
                name="apple-mobile-web-app-status-bar-style"
                content="default"
            />

            <meta name="apple-mobile-web-app-title" content="PWA App" />
            <meta name="description" content="Best PWA App in the world" />

            <meta name="format-detection" content="telephone=no" />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta
                name="msapplication-config"
                content="./icons/browserconfig.xml"
            />
            <meta name="msapplication-TileColor" content="#000" />
            <meta name="msapplication-tap-highlight" content="no" />
            <meta name="theme-color" content="#fff" />
            <link rel="apple-touch-icon" href="./icons/touch-icon-iphone.png" />
            <link
                rel="apple-touch-icon"
                sizes="152x152"
                href="./icons/android-chrome-512x512"
            />

            <link
                rel="icon"
                type="image/png"
                sizes="32x32"
                href="./icons/favicon-32x32.png"
            />
            <link
                rel="icon"
                type="image/png"
                sizes="16x16"
                href="./icons/favicon-16x16.png"
            />
            <link rel="manifest" href="./manifest.json" />
            <link
                rel="mask-icon"
                href="./icons/safari-pinned-tab.svg"
                color="#fff"
            />
            <link rel="shortcut icon" href="./favicon.ico" />
        </>
    );
};
