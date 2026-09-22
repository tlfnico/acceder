import React from "react";
import Link from "next/link";
import Image from "next/image";
import styles from "./Header.module.css";

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.logoLink} aria-label="ACCEDER - Ir al Inicio">
          <div className={styles.brandBadge}>
            <Image
              src="/logo-accesibilidad.png"
              alt=""
              width={28}
              height={28}
              className={styles.logoIcon}
              aria-hidden="true"
              priority
            />
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
