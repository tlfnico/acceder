"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions/auth-actions";
import { SessionPayload } from "@/lib/types";
import styles from "./AdminHeader.module.css";

interface AdminHeaderProps {
  session: SessionPayload;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ session }) => {
  const pathname = usePathname();

  const isNavActive = (href: string) => {
    if (href === "/admin") {
      return pathname === "/admin";
    }
    return pathname.startsWith(href);
  };

  const isAdmin = session.rolNombre === "ADMINISTRADOR";

  return (
    <header className={styles.header}>
      <div className={styles.topBar}>
        <Link href="/admin" className={styles.brand} aria-label="ACCEDER - Panel de Administración">
          <span className={styles.brandTitle}>ACCEDER</span>
          <span className={styles.adminTag}>Administración</span>
        </Link>

        <div className={styles.userSection}>
          <div className={styles.userInfo}>
            <span className={styles.userName}>
              {session.nombre} {session.apellido}
            </span>
            <span className={styles.userRole}>
              {isAdmin ? "Administrador" : "Personal de Accesibilidad"}
            </span>
          </div>

          <form action={logoutAction} className={styles.logoutForm}>
            <button type="submit" className={styles.logoutBtn} aria-label="Cerrar sesión">
              Cerrar Sesión
            </button>
          </form>
        </div>
      </div>

      <nav className={styles.navBar} aria-label="Navegación del panel administrativo">
        <div className={styles.navContainer}>
          <Link
            href="/admin"
            className={`${styles.navLink} ${isNavActive("/admin") ? styles.navLinkActive : ""}`}
          >
            Dashboard
          </Link>
          <Link
            href="/admin/modulos"
            className={`${styles.navLink} ${isNavActive("/admin/modulos") ? styles.navLinkActive : ""}`}
          >
            Módulos
          </Link>
          <Link
            href="/admin/categorias"
            className={`${styles.navLink} ${isNavActive("/admin/categorias") ? styles.navLinkActive : ""}`}
          >
            Categorías
          </Link>
          <Link
            href="/admin/contenidos"
            className={`${styles.navLink} ${isNavActive("/admin/contenidos") ? styles.navLinkActive : ""}`}
          >
            Contenidos
          </Link>
          {isAdmin && (
            <Link
              href="/admin/usuarios"
              className={`${styles.navLink} ${isNavActive("/admin/usuarios") ? styles.navLinkActive : ""}`}
            >
              Usuarios
            </Link>
          )}

          <Link href="/" target="_blank" className={`${styles.navLink} ${styles.portalLink}`}>
            ↗ Ver Portal Público
          </Link>
        </div>
      </nav>
    </header>
  );
};
