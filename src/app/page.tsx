import React from "react";
import { getModulosActivos } from "@/data/modulos";
import { ModuleCard } from "@/components/ModuleCard";
import styles from "./page.module.css";

export default function HomePage() {
  // Consultar módulos activos ordenados por el campo 'orden'
  const modulos = getModulosActivos();

  return (
    <div className={styles.wrapper}>
      {/* Sección principal de módulos de información */}
      <section className={styles.modulesSection} aria-labelledby="titulo-principal">
        <header className={styles.sectionHeader}>
          <h1 id="titulo-principal" className={styles.sectionTitle}>
            Módulos de Información
          </h1>
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
