import Scene from "@/components/Scene";
import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <div className={styles.viewport}>
        <Scene />
      </div>
    </main>
  );
}
