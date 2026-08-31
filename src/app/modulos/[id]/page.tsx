import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModuloById } from "@/data/modulos";
import { getCategoriasPorModulo } from "@/data/categorias";
import { Breadcrumb } from "@/components/Breadcrumb";
import { CategoryCard } from "@/components/CategoryCard";
import styles from "./page.module.css";

interface ModulePageProps {
  params: Promise<{ id: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const resolvedParams = await params;
  const idModulo = parseInt(resolvedParams.id, 10);

  if (isNaN(idModulo)) {
    notFound();
  }

  // Obtener información del módulo desde PostgreSQL (solo activos)
  const modulo = await getModuloById(idModulo);

  if (!modulo) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Módulo no encontrado</h1>
        <p>El módulo solicitado no existe o no se encuentra activo.</p>
        <Link href="/" className={styles.backButton}>
          ← Volver a la página de inicio
        </Link>
      </div>
    );
  }

  // Obtener categorías activas del módulo desde PostgreSQL
  const categorias = await getCategoriasPorModulo(idModulo);

  return (
    <div className={styles.container}>
      {/* Breadcrumbs de navegación */}
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: modulo.nombre },
        ]}
      />

      <header className={styles.header}>
        <h1 className={styles.title}>{modulo.nombre}</h1>
        <p className={styles.subtitle}>
          Seleccioná una categoría para explorar los recursos y trámites disponibles:
        </p>
      </header>

      {categorias.length === 0 ? (
        <p className={styles.emptyMessage} role="status">
          No hay categorías disponibles activas en este módulo actualmente.
        </p>
      ) : (
        <div className={styles.grid}>
          {categorias.map((categoria) => (
            <CategoryCard key={categoria.id} categoria={categoria} idModulo={idModulo} />
          ))}
        </div>
      )}
    </div>
  );
}
