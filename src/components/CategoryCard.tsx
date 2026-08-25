import React from "react";
import Link from "next/link";
import { Categoria } from "@/lib/types";
import styles from "./CategoryCard.module.css";

interface CategoryCardProps {
  categoria: Categoria;
  idModulo: number;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ categoria, idModulo }) => {
  return (
    <Link
      href={`/modulos/${idModulo}/categorias/${categoria.id}`}
      className={styles.card}
      aria-label={`Ver contenidos de la categoría ${categoria.nombre}`}
    >
      <div className={styles.content}>
        <h3 className={styles.title}>{categoria.nombre}</h3>
        <p className={styles.description}>{categoria.descripcion}</p>
      </div>
      <span className={styles.actionText}>
        Ver recursos →
      </span>
    </Link>
  );
};
