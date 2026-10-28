import React from "react";
import Image from "next/image";
import styles from "./ModuloPictogram.module.css";

interface ModuloPictogramProps {
  idModulo: number;
  nombreModulo?: string;
  className?: string;
}

/**
 * Asociación explícita y directa entre el ID numérico del módulo y la ruta del pictograma ARASAAC.
 * Rutas estáticas exactas basadas en los archivos presentes en public/pictogramas/.
 *
 * Módulos sin correspondencia (IDs 10 y 12):
 * No se asignan imágenes arbitrarias; se reutilizan los gráficos vectoriales existentes
 * como fallback seguro manteniendo las mismas dimensiones y alineación.
 */
const PICTOGRAMAS_ARASAAC: Record<number, string> = {
  1: "/pictogramas/derechos.png",
  2: "/pictogramas/salud.png",
  3: "/pictogramas/educación.png",
  4: "/pictogramas/productos%20de%20apoyo.png",
  5: "/pictogramas/transporte.png",
  6: "/pictogramas/turismo.png",
  7: "/pictogramas/cultura.png",
  8: "/pictogramas/mercado%20laboral.png",
  9: "/pictogramas/comercio.png",
  11: "/pictogramas/información.png",
};

/**
 * Componente de Pictograma para Módulos.
 *
 * Accesibilidad (WCAG 1.1.1):
 * La imagen se renderiza con alt="" y aria-hidden="true" porque es un elemento gráfico
 * de apoyo cognitivo. El nombre textual del módulo ya está provisto de forma semántica
 * tanto en el título <h2> como en el aria-label del enlace contenedor.
 */
export const ModuloPictogram: React.FC<ModuloPictogramProps> = ({
  idModulo,
  className = "",
}) => {
  const pictogramaSrc = PICTOGRAMAS_ARASAAC[idModulo];

  if (pictogramaSrc) {
    return (
      <Image
        src={pictogramaSrc}
        alt=""
        width={68}
        height={68}
        className={`${styles.pictogram} ${className}`.trim()}
        aria-hidden="true"
        priority={false}
      />
    );
  }

  // Fallback para Módulo 10: Dirección de Accesibilidad (Escudo / Sello institucional)
  if (idModulo === 10) {
    return (
      <svg
        className={`${styles.fallbackSvg} ${className}`.trim()}
        width="68"
        height="68"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        focusable="false"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );
  }

  // Fallback para Módulo 12 (Otros) o módulos futuros sin pictograma: Carpeta / Documentación
  return (
    <svg
      className={`${styles.fallbackSvg} ${className}`.trim()}
      width="68"
      height="68"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
    </svg>
  );
};
