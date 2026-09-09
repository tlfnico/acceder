"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { CategoriaAdmin } from "@/data/categorias";
import { ContenidoAdmin } from "@/data/contenidos";
import { editarContenidoAction, ContenidoFormState } from "../../actions/contenidos-actions";
import styles from "../../admin-form.module.css";

interface ContenidoEditFormProps {
  contenido: ContenidoAdmin;
  categorias: CategoriaAdmin[];
}

export default function ContenidoEditForm({ contenido, categorias }: ContenidoEditFormProps) {
  const editarConId = editarContenidoAction.bind(null, contenido.id);
  const [state, formAction, isPending] = useActionState(editarConId, undefined);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Editar Contenido: {contenido.titulo}</h1>
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
              defaultValue={contenido.id_categoria}
              className={styles.select}
            >
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
              defaultValue={contenido.titulo}
              className={styles.input}
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
              defaultValue={contenido.descripcion}
              className={styles.textarea}
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
                defaultValue={contenido.direccion || ""}
                className={styles.input}
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
                defaultValue={contenido.telefono || ""}
                className={styles.input}
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
                defaultValue={contenido.email || ""}
                className={styles.input}
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
                defaultValue={contenido.horario || ""}
                className={styles.input}
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
              defaultValue={contenido.enlace || ""}
              className={styles.input}
            />
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="activo"
              name="activo"
              defaultChecked={contenido.activo}
              className={styles.checkbox}
            />
            <label htmlFor="activo" className={styles.checkboxLabel}>
              Contenido Activo (Visible en el portal público)
            </label>
          </div>

          {!contenido.activo && (
            <div className={styles.warningBanner}>
              ⚠️ <strong>Atención:</strong> Al estar inactivo, este contenido permanecerá oculto para los usuarios del portal público.
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
            <Link href="/admin/contenidos" className={styles.secondaryBtn}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
