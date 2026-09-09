"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { crearModuloAction, ModuloFormState } from "../../actions/modulos-actions";
import styles from "../../admin-form.module.css";

export default function NuevoModuloPage() {
  const [state, formAction, isPending] = useActionState(crearModuloAction, undefined);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Crear Nuevo Módulo</h1>
        <Link href="/admin/modulos" className={styles.secondaryBtn}>
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
            <label htmlFor="nombre" className={styles.label}>
              Nombre del Módulo <span className={styles.requiredTag}>*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className={styles.input}
              placeholder="Ej: Trámites y Certificados"
            />
            <span className={styles.hint}>
              Nombre visible que identificará este módulo temático.
            </span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="orden" className={styles.label}>
              Orden de Despliegue <span className={styles.requiredTag}>*</span>
            </label>
            <input
              id="orden"
              name="orden"
              type="number"
              min="0"
              defaultValue="0"
              required
              className={styles.input}
              style={{ maxWidth: "160px" }}
            />
            <span className={styles.hint}>
              Valor numérico para determinar la posición en el menú y pantalla de inicio (menor número aparece primero).
            </span>
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
              Módulo Activo (Visible en el portal público)
            </label>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={isPending}
              className={styles.primaryBtn}
            >
              {isPending ? "Guardando..." : "Guardar Módulo"}
            </button>
            <Link href="/admin/modulos" className={styles.secondaryBtn}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
