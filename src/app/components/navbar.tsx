import Image from "next/image";
import styles from "./style.module.css";

export default function Navbar() {
  return (
    <div className={styles.navbar}>
      <div className={styles.navbar__logo}>
        <Image src="/logo-v0.png" alt="logo" width={50} height={50} />
        Lucid
      </div>
      <div className={styles.navbar__links}>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </div>
    </div>
  );
}
