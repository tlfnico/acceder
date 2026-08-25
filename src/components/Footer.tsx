import React from "react";
import styles from "./Footer.module.css";

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <p className={styles.brand}>ACCEDER — Recursero Digital de Accesibilidad</p>
        <p className={styles.text}>
          Información pública sobre servicios, trámites y derechos para personas con discapacidad, familias y profesionales.
        </p>
      </div>
    </footer>
  );
};
