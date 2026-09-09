"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { Modulo } from "@/lib/types";
import { editarModuloAction, ModuloFormState } from "../../actions/modulos-actions";
import styles from "../../admin-form.module.css";

interface ModuloEditFormProps {
  modulo: Modulo;
}

export default function ModuloEditForm({ modulo }: ModuloEditFormProps) {
  const editarConId = editarModuloAction.bind(null, modulo.id);
  const [state, formAction, isPending] = useActionState(editarConId, undefined);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Editar Módulo: {modulo.nombre}</h1>
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
              defaultValue={modulo.nombre}
              className={styles.input}
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
              required
              defaultValue={modulo.orden}
              className={styles.input}
              style={{ maxWidth: "160px" }}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="activo"
              name="activo"
              defaultChecked={modulo.activo}
              className={styles.checkbox}
            />
            <label htmlFor="activo" className={styles.checkboxLabel}>
              Módulo Activo (Visible en el portal público)
            </label>
          </div>

          {!modulo.activo && (
            <div className={styles.warningBanner}>
              ⚠️ <strong>Atención:</strong> Al estar inactivo, este módulo y todas sus categorías asociadas permanecerán ocultos para los usuarios del portal público.
            </div>
          )}

          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={isPending}
              className={styles.primaryBtn}
            >
              {isPending ? "Guardando..." : "Guardar Cambios"}
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
