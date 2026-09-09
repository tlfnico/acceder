import React from "react";
import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { getModulosStats } from "@/data/modulos";
import { getCategoriasStats } from "@/data/categorias";
import { getContenidosStats } from "@/data/contenidos";
import { getUsuariosAdmin } from "@/data/usuarios";
import styles from "./dashboard.module.css";

export const metadata = {
  title: "Dashboard - Panel Administrativo ACCEDER",
};

export default async function AdminDashboardPage() {
  const session = await verifySession();

  // Consultas paralelas a PostgreSQL
  const [modulosStats, categoriasStats, contenidosStats, usuarios] = await Promise.all([
    getModulosStats(),
    getCategoriasStats(),
    getContenidosStats(),
    session.rolNombre === "ADMINISTRADOR" ? getUsuariosAdmin() : Promise.resolve([]),
  ]);

  const isAdmin = session.rolNombre === "ADMINISTRADOR";
  const totalUsuarios = usuarios.length;
  const usuariosActivos = usuarios.filter((u) => u.activo).length;
  const usuariosInactivos = totalUsuarios - usuariosActivos;

  return (
    <div className={styles.container}>
      <div className={styles.welcomeCard}>
        <h1 className={styles.welcomeTitle}>
          Bienvenido, {session.nombre} {session.apellido}
        </h1>
        <p className={styles.welcomeSubtitle}>
          Rol actual: <strong>{isAdmin ? "Administrador" : "Personal de Accesibilidad"}</strong>.
          Desde este panel puede administrar los recursos, categorías y contenidos de ACCEDER.
        </p>
      </div>

      <section aria-label="Métricas generales del sistema" className={styles.grid}>
        {/* Módulos */}
        <div className={styles.statCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Módulos</h2>
            <span className={styles.totalBadge}>{modulosStats.total}</span>
          </div>
          <div className={styles.metricsList}>
            <div className={styles.metricRow}>
              <span>Activos en portal público:</span>
              <span className={`${styles.metricValue} ${styles.activeValue}`}>
                {modulosStats.activos}
              </span>
            </div>
            <div className={styles.metricRow}>
              <span>Inactivos / Ocultos:</span>
              <span className={`${styles.metricValue} ${styles.inactiveValue}`}>
                {modulosStats.inactivos}
              </span>
            </div>
          </div>
          <Link href="/admin/modulos" className={styles.cardAction}>
            Gestionar Módulos →
          </Link>
        </div>

        {/* Categorías */}
        <div className={styles.statCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Categorías</h2>
            <span className={styles.totalBadge}>{categoriasStats.total}</span>
          </div>
          <div className={styles.metricsList}>
            <div className={styles.metricRow}>
              <span>Activas en portal público:</span>
              <span className={`${styles.metricValue} ${styles.activeValue}`}>
                {categoriasStats.activas}
              </span>
            </div>
            <div className={styles.metricRow}>
              <span>Inactivas / Ocultas:</span>
              <span className={`${styles.metricValue} ${styles.inactiveValue}`}>
                {categoriasStats.inactivas}
              </span>
            </div>
          </div>
          <Link href="/admin/categorias" className={styles.cardAction}>
            Gestionar Categorías →
          </Link>
        </div>

        {/* Contenidos */}
        <div className={styles.statCard}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Contenidos</h2>
            <span className={styles.totalBadge}>{contenidosStats.total}</span>
          </div>
          <div className={styles.metricsList}>
            <div className={styles.metricRow}>
              <span>Activos en portal público:</span>
              <span className={`${styles.metricValue} ${styles.activeValue}`}>
                {contenidosStats.activos}
              </span>
            </div>
            <div className={styles.metricRow}>
              <span>Inactivos / Ocultos:</span>
              <span className={`${styles.metricValue} ${styles.inactiveValue}`}>
                {contenidosStats.inactivos}
              </span>
            </div>
          </div>
          <Link href="/admin/contenidos" className={styles.cardAction}>
            Gestionar Contenidos →
          </Link>
        </div>

        {/* Usuarios (Solo ADMINISTRADOR) */}
        {isAdmin && (
          <div className={styles.statCard}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Usuarios</h2>
              <span className={styles.totalBadge}>{totalUsuarios}</span>
            </div>
            <div className={styles.metricsList}>
              <div className={styles.metricRow}>
                <span>Cuentas activas:</span>
                <span className={`${styles.metricValue} ${styles.activeValue}`}>
                  {usuariosActivos}
                </span>
              </div>
              <div className={styles.metricRow}>
                <span>Cuentas inactivas:</span>
                <span className={`${styles.metricValue} ${styles.inactiveValue}`}>
                  {usuariosInactivos}
                </span>
              </div>
            </div>
            <Link href="/admin/usuarios" className={styles.cardAction}>
              Gestionar Usuarios →
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
