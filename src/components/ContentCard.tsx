import React from "react";
import Link from "next/link";
import { Contenido } from "@/lib/types";
import styles from "./ContentCard.module.css";

interface ContentCardProps {
  contenido: Contenido;
  idModulo: number;
  idCategoria: number;
}

export const ContentCard: React.FC<ContentCardProps> = ({
  contenido,
  idModulo,
  idCategoria,
}) => {
  return (
    <article className={styles.card}>
      <div className={styles.body}>
        <h3 className={styles.title}>
          <Link
            href={`/modulos/${idModulo}/categorias/${idCategoria}/contenido/${contenido.id}`}
            className={styles.titleLink}
          >
            {contenido.titulo}
          </Link>
        </h3>
        <p className={styles.description}>{contenido.descripcion}</p>

        {/* Badges para indicar información disponible de un vistazo sin bloques vacíos */}
        <div className={styles.badgeGroup}>
          {contenido.direccion && <span className={styles.badge}>📍 Dirección física</span>}
          {contenido.telefono && <span className={styles.badge}>📞 Teléfono</span>}
          {contenido.email && <span className={styles.badge}>✉️ Email</span>}
          {contenido.enlace && <span className={styles.badge}>🌐 Sitio web</span>}
          {contenido.horario && <span className={styles.badge}>🕒 Horarios</span>}
        </div>
      </div>

      <div className={styles.footer}>
        <Link
          href={`/modulos/${idModulo}/categorias/${idCategoria}/contenido/${contenido.id}`}
          className={styles.detailButton}
          aria-label={`Ver información detallada de ${contenido.titulo}`}
        >
          Ver detalle completo →
        </Link>
      </div>
    </article>
  );
};
