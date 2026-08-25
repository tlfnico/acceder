import React from "react";
import Link from "next/link";
import { Modulo } from "@/lib/types";
import { ModuloPictogram } from "./ModuloPictogram";
import styles from "./ModuleCard.module.css";

interface ModuleCardProps {
  modulo: Modulo;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ modulo }) => {
  return (
    <Link
      href={`/modulos/${modulo.id}`}
      className={styles.card}
      aria-label={`Ver categorías del módulo ${modulo.nombre}`}
    >
      <div className={styles.iconContainer}>
        <ModuloPictogram idModulo={modulo.id} nombreModulo={modulo.nombre} className={styles.icon} />
      </div>
      <h2 className={styles.title}>{modulo.nombre}</h2>
    </Link>
  );
};
