import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getModuloById } from "@/data/modulos";
import { getCategoriaById } from "@/data/categorias";
import { getContenidoById } from "@/data/contenidos";
import { Breadcrumb } from "@/components/Breadcrumb";
import styles from "./page.module.css";

interface ContentPageProps {
  params: Promise<{
    id: string;
    id_categoria: string;
    id_contenido: string;
  }>;
}

export default async function ContentPage({ params }: ContentPageProps) {
  const resolvedParams = await params;
  const idModulo = parseInt(resolvedParams.id, 10);
  const idCategoria = parseInt(resolvedParams.id_categoria, 10);
  const idContenido = parseInt(resolvedParams.id_contenido, 10);

  if (isNaN(idModulo) || isNaN(idCategoria) || isNaN(idContenido)) {
    notFound();
  }

  const modulo = getModuloById(idModulo);
  const categoria = getCategoriaById(idCategoria);
  const contenido = getContenidoById(idContenido);

  // Verificación estricta de pertenencia y estado activo
  if (
    !modulo ||
    !categoria ||
    !contenido ||
    categoria.id_modulo !== idModulo ||
    contenido.id_categoria !== idCategoria
  ) {
    return (
      <div className={styles.notFoundContainer}>
        <h1>Contenido no encontrado</h1>
        <p>El contenido solicitado no existe o no se encuentra activo.</p>
        <Link href="/" className={styles.backButton}>
          ← Volver al inicio
        </Link>
      </div>
    );
  }

  // Evaluar si existe al menos un campo opcional de contacto/ubicación
  const tieneDatosContacto = Boolean(
    contenido.direccion ||
    contenido.telefono ||
    contenido.email ||
    contenido.enlace ||
    contenido.horario
  );

  return (
    <article className={styles.container}>
      {/* Breadcrumbs de navegación */}
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: modulo.nombre, href: `/modulos/${idModulo}` },
          { label: categoria.nombre, href: `/modulos/${idModulo}/categorias/${idCategoria}` },
          { label: contenido.titulo },
        ]}
      />

      <header className={styles.header}>
        <div className={styles.categoryBadge}>
          {modulo.nombre} &rsaquo; {categoria.nombre}
        </div>
        <h1 className={styles.title}>{contenido.titulo}</h1>
      </header>

      {/* Descripción principal */}
      <section className={styles.descriptionSection} aria-label="Descripción del recurso">
        <h2 className={styles.sectionTitle}>Información General</h2>
        <p className={styles.descriptionText}>{contenido.descripcion}</p>
      </section>

      {/* RENDERIZADO CONDICIONAL DE CAMPOS OPCIONALES */}
      {/* Si NO existen datos opcionales, NO se renderiza esta sección ni bloques vacíos */}
      {tieneDatosContacto && (
        <section className={styles.contactSection} aria-label="Datos de contacto y atención">
          <h2 className={styles.sectionTitle}>Información de Contacto y Atención</h2>

          <dl className={styles.contactList}>
            {/* Dirección física */}
            {contenido.direccion && (
              <div className={styles.contactItem}>
                <dt className={styles.label}>📍 Dirección:</dt>
                <dd className={styles.value}>{contenido.direccion}</dd>
              </div>
            )}

            {/* Teléfono accesible con enlace tel: */}
            {contenido.telefono && (
              <div className={styles.contactItem}>
                <dt className={styles.label}>📞 Teléfono de contacto:</dt>
                <dd className={styles.value}>
                  <a href={`tel:${contenido.telefono.replace(/\s+/g, "")}`} className={styles.actionLink}>
                    {contenido.telefono}
                  </a>
                </dd>
              </div>
            )}

            {/* Email accesible con enlace mailto: */}
            {contenido.email && (
              <div className={styles.contactItem}>
                <dt className={styles.label}>✉️ Correo electrónico:</dt>
                <dd className={styles.value}>
                  <a href={`mailto:${contenido.email}`} className={styles.actionLink}>
                    {contenido.email}
                  </a>
                </dd>
              </div>
            )}

            {/* Enlace externo seguro con target="_blank" rel="noopener noreferrer" */}
            {contenido.enlace && (
              <div className={styles.contactItem}>
                <dt className={styles.label}>🌐 Sitio web de referencia:</dt>
                <dd className={styles.value}>
                  <a
                    href={contenido.enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.externalLink}
                    aria-label={`Visitar sitio web externo: ${contenido.titulo} (se abre en nueva pestaña)`}
                  >
                    {contenido.enlace} <span aria-hidden="true">↗</span>
                  </a>
                </dd>
              </div>
            )}

            {/* Horario de atención */}
            {contenido.horario && (
              <div className={styles.contactItem}>
                <dt className={styles.label}>🕒 Horario de atención:</dt>
                <dd className={styles.value}>{contenido.horario}</dd>
              </div>
            )}
          </dl>
        </section>
      )}

      {/* Pie con navegación de retorno */}
      <footer className={styles.footerNav}>
        <Link
          href={`/modulos/${idModulo}/categorias/${idCategoria}`}
          className={styles.returnLink}
        >
          ← Volver a la categoría {categoria.nombre}
        </Link>
      </footer>
    </article>
  );
}
