import Image from "next/image";
import styles from "./style.module.css";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <a className={styles.navbar__logo} href="/">
        <Image src="/logo-v0.png" alt="logo" width={80} height={80} />
        Lucid
      </a>
      <div className={styles.navbar__links}>
        <a href="/retrieve">Try Now</a>
      </div>
    </div>
  );
}
