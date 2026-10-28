import React from "react";
import { getModulosActivos } from "@/data/modulos";
import { ModuleCard } from "@/components/ModuleCard";
import styles from "./page.module.css";

export default async function HomePage() {
  // Consultar módulos activos desde PostgreSQL ordenados por el campo 'orden'
  const modulos = await getModulosActivos();

  return (
    <div className={styles.wrapper}>
      {/* Bloque introductorio breve y accesible */}
      <section className={styles.introCard} aria-labelledby="intro-titulo">
        <h1 id="intro-titulo" className={styles.introTitle}>
          Recursero Digital de Accesibilidad
        </h1>
        <p className={styles.introDescription}>
          Bienvenido a ACCEDER. Esta plataforma reúne información pública sobre servicios, trámites, derechos y apoyos para personas con discapacidad, familias y profesionales. Seleccioná una temática para consultar las opciones disponibles.
        </p>
      </section>

      {/* Sección principal de módulos de información */}
      <section className={styles.modulesSection} aria-labelledby="titulo-modulos">
        <header className={styles.sectionHeader}>
          <h2 id="titulo-modulos" className={styles.sectionTitle}>
            Módulos de Información
          </h2>
          <p className={styles.sectionDescription}>
            Seleccioná un área temática para consultar las categorías y recursos disponibles.
          </p>
        </header>

        {modulos.length === 0 ? (
          <p className={styles.emptyMessage} role="status">
            No hay módulos disponibles en este momento.
          </p>
        ) : (
          <div className={styles.grid}>
            {modulos.map((modulo) => (
              <ModuleCard key={modulo.id} modulo={modulo} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
