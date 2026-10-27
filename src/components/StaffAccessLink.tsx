"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./StaffAccessLink.module.css";

/**
 * Enlace discreto y accesible para que el personal de la Dirección de Accesibilidad
 * ingrese al panel de administración sin necesidad de escribir la URL manualmente.
 * 
 * Se oculta automáticamente cuando el usuario ya se encuentra en rutas administrativas (/admin/*),
 * incluyendo la pantalla de inicio de sesión (/admin/login) para evitar enlaces autorreferenciales.
 */
export const StaffAccessLink: React.FC = () => {
  const pathname = usePathname();

  // Si estamos en cualquier ruta administrativa, no mostrar el enlace para evitar duplicaciones
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <Link
      href="/admin/login"
      className={styles.link}
      title="Acceso al panel de administración"
    >
      <svg
        className={styles.icon}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        width="15"
        height="15"
      >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <span className={styles.label}>Acceso al personal</span>
    </Link>
  );
};
