import React from "react";
import styles from "./StatusBadge.module.css";

interface StatusBadgeProps {
  activo: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ activo }) => {
  return (
    <span
      className={`${styles.badge} ${activo ? styles.activo : styles.inactivo}`}
      role="status"
      aria-label={`Estado: ${activo ? "Activo" : "Inactivo"}`}
    >
      <span className={styles.dot} aria-hidden="true" />
      {activo ? "Activo" : "Inactivo"}
    </span>
  );
};
