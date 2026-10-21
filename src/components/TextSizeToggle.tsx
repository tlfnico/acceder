"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import styles from "./TextSizeToggle.module.css";

const STORAGE_KEY = "acceder-text-size";

export const TextSizeToggle: React.FC = () => {
  const pathname = usePathname();
  const [isLarge, setIsLarge] = useState(false);

  // Sincronizar preferencia con localStorage y verificar si estamos en ruta pública
  useEffect(() => {
    // Si la ruta actual pertenece al panel administrativo, asegurar que el cuerpo no tenga el atributo
    if (pathname?.startsWith("/admin")) {
      document.body.removeAttribute("data-text-size");
      return;
    }

    // En el portal público, aplicar la preferencia guardada en el cliente
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "large") {
        setIsLarge(true);
        document.body.setAttribute("data-text-size", "large");
      } else {
        setIsLarge(false);
        document.body.removeAttribute("data-text-size");
      }
    } catch {
      // Manejar entornos donde localStorage esté deshabilitado por privacidad
    }
  }, [pathname]);

  // Si estamos en el panel administrativo, no renderizar el botón
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleToggle = () => {
    const nextState = !isLarge;
    setIsLarge(nextState);

    if (nextState) {
      document.body.setAttribute("data-text-size", "large");
      try {
        localStorage.setItem(STORAGE_KEY, "large");
      } catch {
        // Fallback silencioso
      }
    } else {
      document.body.removeAttribute("data-text-size");
      try {
        localStorage.setItem(STORAGE_KEY, "normal");
      } catch {
        // Fallback silencioso
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className={`${styles.button} ${isLarge ? styles.buttonActive : ""}`}
      aria-pressed={isLarge}
      aria-label={isLarge ? "Restaurar tamaño de letra normal" : "Aumentar tamaño de letra"}
    >
      <span className={styles.icon} aria-hidden="true">
        {isLarge ? "A−" : "A+"}
      </span>
      <span className={styles.label}>
        {isLarge ? "Letra normal" : "Agrandar letra"}
      </span>
    </button>
  );
};
