"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { Modulo } from "@/lib/types";
import { crearCategoriaAction, CategoriaFormState } from "../../actions/categorias-actions";
import styles from "../../admin-form.module.css";

interface CategoriaCreateFormProps {
  modulos: Modulo[];
}

export default function CategoriaCreateForm({ modulos }: CategoriaCreateFormProps) {
  const [state, formAction, isPending] = useActionState(crearCategoriaAction, undefined);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Crear Nueva Categoría</h1>
        <Link href="/admin/categorias" className={styles.secondaryBtn}>
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
            <label htmlFor="id_modulo" className={styles.label}>
              Módulo Perteneciente <span className={styles.requiredTag}>*</span>
            </label>
            <select
              id="id_modulo"
              name="id_modulo"
              required
              defaultValue=""
              className={styles.select}
            >
              <option value="" disabled>
                -- Seleccione un Módulo --
              </option>
              {modulos.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.nombre} {!m.activo ? "(Inactivo)" : ""}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="nombre" className={styles.label}>
              Nombre de la Categoría <span className={styles.requiredTag}>*</span>
            </label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              required
              className={styles.input}
              placeholder="Ej: Certificado Único de Discapacidad (CUD)"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="descripcion" className={styles.label}>
              Descripción <span className={styles.requiredTag}>*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              required
              className={styles.textarea}
              placeholder="Describa el alcance de los contenidos de esta categoría..."
            />
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
              Categoría Activa (Visible en el portal público)
            </label>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={isPending}
              className={styles.primaryBtn}
            >
              {isPending ? "Guardando..." : "Guardar Categoría"}
            </button>
            <Link href="/admin/categorias" className={styles.secondaryBtn}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
