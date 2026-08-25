import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModuloById } from "@/data/modulos";
import { getCategoriaById } from "@/data/categorias";
import { getContenidosPorCategoria } from "@/data/contenidos";
import { Breadcrumb } from "@/components/Breadcrumb";
import { ContentCard } from "@/components/ContentCard";
import styles from "./page.module.css";

interface CategoryPageProps {
  params: Promise<{
    id: string;
    id_categoria: string;
  }>;
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const resolvedParams = await params;
  const idModulo = parseInt(resolvedParams.id, 10);
  const idCategoria = parseInt(resolvedParams.id_categoria, 10);

  if (isNaN(idModulo) || isNaN(idCategoria)) {
    notFound();
  }

  const modulo = getModuloById(idModulo);
  const categoria = getCategoriaById(idCategoria);

  // Verificar que el módulo y la categoría existan, estén activos y coincida la relación
  if (!modulo || !categoria || categoria.id_modulo !== idModulo) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Categoría no encontrada</h1>
        <p>La categoría solicitada no existe o no pertenece a este módulo.</p>
        <Link href={`/modulos/${idModulo}`} className={styles.backButton}>
          ← Volver al módulo
        </Link>
      </div>
    );
  }

  // Obtener la lista de contenidos activos
  const contenidos = getContenidosPorCategoria(idCategoria);

  return (
    <div className={styles.container}>
      {/* Breadcrumbs de navegación */}
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: modulo.nombre, href: `/modulos/${idModulo}` },
          { label: categoria.nombre },
        ]}
      />

      <header className={styles.header}>
        <span className={styles.moduleBadge}>Módulo: {modulo.nombre}</span>
        <h1 className={styles.title}>{categoria.nombre}</h1>
        <p className={styles.description}>{categoria.descripcion}</p>
      </header>

      <section className={styles.contentSection} aria-label="Recursos disponibles">
        <h2 className={styles.sectionTitle}>
          Recursos y Contenidos Disponibles ({contenidos.length})
        </h2>

        {contenidos.length === 0 ? (
          <p className={styles.emptyMessage} role="status">
            No se encontraron contenidos o recursos activos registrados en esta categoría.
          </p>
        ) : (
          <div className={styles.grid}>
            {contenidos.map((contenido) => (
              <ContentCard
                key={contenido.id}
                contenido={contenido}
                idModulo={idModulo}
                idCategoria={idCategoria}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
