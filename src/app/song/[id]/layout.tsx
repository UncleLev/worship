import styles from './page.module.scss' 

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <div className={styles.layout}>{children}</div>;
}
