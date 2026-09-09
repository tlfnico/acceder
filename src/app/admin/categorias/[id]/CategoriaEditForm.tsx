"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { Modulo } from "@/lib/types";
import { CategoriaAdmin } from "@/data/categorias";
import { editarCategoriaAction, CategoriaFormState } from "../../actions/categorias-actions";
import styles from "../../admin-form.module.css";

interface CategoriaEditFormProps {
  categoria: CategoriaAdmin;
  modulos: Modulo[];
}

export default function CategoriaEditForm({ categoria, modulos }: CategoriaEditFormProps) {
  const editarConId = editarCategoriaAction.bind(null, categoria.id);
  const [state, formAction, isPending] = useActionState(editarConId, undefined);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Editar Categoría: {categoria.nombre}</h1>
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
              defaultValue={categoria.id_modulo}
              className={styles.select}
            >
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
              defaultValue={categoria.nombre}
              className={styles.input}
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
              defaultValue={categoria.descripcion}
              className={styles.textarea}
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
              defaultValue={categoria.orden}
              className={styles.input}
              style={{ maxWidth: "160px" }}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="activo"
              name="activo"
              defaultChecked={categoria.activo}
              className={styles.checkbox}
            />
            <label htmlFor="activo" className={styles.checkboxLabel}>
              Categoría Activa (Visible en el portal público)
            </label>
          </div>

          {!categoria.activo && (
            <div className={styles.warningBanner}>
              ⚠️ <strong>Atención:</strong> Al estar inactiva, esta categoría y todos sus contenidos asociados permanecerán ocultos para los usuarios del portal público.
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
            <Link href="/admin/categorias" className={styles.secondaryBtn}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
