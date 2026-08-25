import React from "react";
import Link from "next/link";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink} aria-label="ACCEDER - Ir al Inicio">
          <div className={styles.brandBadge}>
            <span className={styles.logoText}>ACCEDER</span>
          </div>
          <span className={styles.tagline}>Recursero Digital de Accesibilidad</span>
        </Link>
        <nav className={styles.nav} aria-label="Navegación principal">
          <Link href="/" className={styles.navLink}>
            Inicio
          </Link>
        </nav>
      </div>
    </header>
  );
};
