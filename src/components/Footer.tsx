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
        <p className={styles.credit}>Realizado por Diaz Nicolas</p>
        <div className={styles.attribution}>
          <p>
            Logo de Accesibilidad por{" "}
            <a
              href="https://commons.wikimedia.org/wiki/User:Klingbeil16"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attributionLink}
            >
              Klingbeil16
            </a>{" "}
            — Licencia{" "}
            <a
              href="https://creativecommons.org/licenses/by-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attributionLink}
            >
              CC BY-SA 4.0
            </a>{" "}
            (vía{" "}
            <a
              href="https://commons.wikimedia.org/w/index.php?curid=136638130"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attributionLink}
            >
              Wikimedia Commons
            </a>
            )
          </p>
        </div>
      </div>
    </footer>
  );
};
