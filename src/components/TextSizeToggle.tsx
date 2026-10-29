"use client";

import React, { useEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import styles from "./TextSizeToggle.module.css";

const STORAGE_KEY = "acceder-text-size";

export const TextSizeToggle: React.FC = () => {
  const pathname = usePathname();
  const isLarge = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("acceder-text-size-change", onStoreChange);
      return () => window.removeEventListener("acceder-text-size-change", onStoreChange);
    },
    () => {
      try {
        return localStorage.getItem(STORAGE_KEY) === "large";
      } catch {
        return false;
      }
    },
    () => false
  );

  // Sincronizar preferencia con localStorage y verificar si estamos en ruta pública
  useEffect(() => {
    // Si la ruta actual pertenece al panel administrativo, asegurar que el cuerpo no tenga el atributo
    if (pathname?.startsWith("/admin")) {
      document.body.removeAttribute("data-text-size");
      return;
    }

    if (isLarge) {
      document.body.setAttribute("data-text-size", "large");
    } else {
      document.body.removeAttribute("data-text-size");
    }
  }, [isLarge, pathname]);

  // Si estamos en el panel administrativo, no renderizar el botón
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const handleToggle = () => {
    const nextState = !isLarge;
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
    window.dispatchEvent(new Event("acceder-text-size-change"));
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
