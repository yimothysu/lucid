import Image from "next/image";
import styles from "./page.module.css";
import theme from "./styles/theme";

export default function Home() {
  return (
    <main className={styles.mainContainer}>
      <div className={styles.title}>
        Making Cool <br /> Shit
      </div>
      <div className={styles.subtitle}>
        Revolutionizing education one video at a time
      </div>
    </main>
  );
}
