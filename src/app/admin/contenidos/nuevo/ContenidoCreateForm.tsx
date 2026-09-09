"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { CategoriaAdmin } from "@/data/categorias";
import { crearContenidoAction, ContenidoFormState } from "../../actions/contenidos-actions";
import styles from "../../admin-form.module.css";

interface ContenidoCreateFormProps {
  categorias: CategoriaAdmin[];
}

export default function ContenidoCreateForm({ categorias }: ContenidoCreateFormProps) {
  const [state, formAction, isPending] = useActionState(crearContenidoAction, undefined);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Crear Nuevo Contenido</h1>
        <Link href="/admin/contenidos" className={styles.secondaryBtn}>
          ← Volver al Listado
        </Link>
      </div>

      <div className={styles.formCard}>
        {state?.error && (
          <div role="alert" className={styles.errorBanner} style={{ marginBottom: "1.5rem" }}>
            {state.error}
          </div>
        )}

        <form action={formAction} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="id_categoria" className={styles.label}>
              Categoría Perteneciente <span className={styles.requiredTag}>*</span>
            </label>
            <select
              id="id_categoria"
              name="id_categoria"
              required
              defaultValue=""
              className={styles.select}
            >
              <option value="" disabled>
                -- Seleccione una Categoría --
              </option>
              {categorias.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.modulo_nombre} › {c.nombre} {!c.activo ? "(Inactiva)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="titulo" className={styles.label}>
              Título del Contenido / Trámite <span className={styles.requiredTag}>*</span>
            </label>
            <input
              id="titulo"
              name="titulo"
              type="text"
              required
              className={styles.input}
              placeholder="Ej: Obtención del CUD por primera vez"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descripcion" className={styles.label}>
              Descripción Detallada <span className={styles.requiredTag}>*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              className={styles.textarea}
              placeholder="Detalle paso a paso los requisitos, documentación a presentar y modalidades de atención..."
              style={{ minHeight: "140px" }}
            />
          </div>

          <h2 style={{ fontSize: "1.1rem", color: "#0d47a1", margin: "1rem 0 0 0" }}>
            Datos de Contacto y Ubicación (Opcionales)
          </h2>
          <p className={styles.hint} style={{ margin: "-0.5rem 0 0.5rem 0" }}>
            Deje en blanco los campos que no correspondan. En el portal público no se mostrarán contenedores vacíos.
          </p>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="direccion" className={styles.label}>
                Dirección Física
              </label>
              <input
                id="direccion"
                name="direccion"
                type="text"
                className={styles.input}
                placeholder="Ej: Av. Paseo Colón 533, CABA"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="telefono" className={styles.label}>
                Teléfono de Contacto
              </label>
              <input
                id="telefono"
                name="telefono"
                type="text"
                className={styles.input}
                placeholder="Ej: 0800-555-3472"
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.input}
                placeholder="Ej: contacto@andis.gob.ar"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="horario" className={styles.label}>
                Horario de Atención
              </label>
              <input
                id="horario"
                name="horario"
                type="text"
                className={styles.input}
                placeholder="Ej: Lunes a Viernes de 8:00 a 16:00 hs"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="enlace" className={styles.label}>
              Enlace Web Oficial
            </label>
            <input
              id="enlace"
              name="enlace"
              type="url"
              className={styles.input}
              placeholder="Ej: https://www.argentina.gob.ar/andis"
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="activo"
              name="activo"
              defaultChecked
              className={styles.checkbox}
            />
            <label htmlFor="activo" className={styles.checkboxLabel}>
              Contenido Activo (Visible en el portal público)
            </label>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={isPending}
              className={styles.primaryBtn}
            >
              {isPending ? "Guardando..." : "Guardar Contenido"}
            </button>
            <Link href="/admin/contenidos" className={styles.secondaryBtn}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
