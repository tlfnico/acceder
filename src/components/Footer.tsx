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
        <p className={styles.credit}>
          Realizado por Diaz Nicolas — Contacto:{" "}
          <a
            href="https://wa.me/5492245474737"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactLink}
            aria-label="Contactar a Diaz Nicolas por WhatsApp al 2245 474737 (se abre en nueva pestaña)"
            title="Enviar mensaje por WhatsApp (2245 474737)"
          >
            WhatsApp
          </a>
          <span className={styles.separator} aria-hidden="true"> · </span>
          <a
            href="https://mail.google.com/mail/?view=cm&fs=1&to=diaznicolas1704@gmail.com"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.contactLink}
            aria-label="Enviar correo a diaznicolas1704@gmail.com abriendo Gmail en una nueva pestaña"
            title="Redactar correo en Gmail a diaznicolas1704@gmail.com"
          >
            Gmail
          </a>
        </p>
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
          <p>
            Pictogramas: Autor: Sergio Palao — Procedencia:{" "}
            <a
              href="https://arasaac.org/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attributionLink}
            >
              ARASAAC
            </a>{" "}
            — Licencia:{" "}
            <a
              href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.attributionLink}
            >
              CC BY-NC-SA 4.0
            </a>{" "}
            — Titular: Gobierno de Aragón.
          </p>
        </div>
      </div>
    </footer>
  );
};
