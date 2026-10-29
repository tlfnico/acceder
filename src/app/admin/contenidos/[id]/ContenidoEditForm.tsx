"use client";

import React, { useState, useActionState } from "react";
import Link from "next/link";
import { Modulo } from "@/lib/types";
import { CategoriaAdmin } from "@/data/categorias";
import { ContenidoAdmin } from "@/data/contenidos";
import { editarContenidoAction } from "../../actions/contenidos-actions";
import styles from "../../admin-form.module.css";

interface ContenidoEditFormProps {
  contenido: ContenidoAdmin;
  modulos: Modulo[];
  categorias: CategoriaAdmin[];
  initialModuloId?: number;
}

export default function ContenidoEditForm({
  contenido,
  modulos,
  categorias,
  initialModuloId,
}: ContenidoEditFormProps) {
  const editarConId = editarContenidoAction.bind(null, contenido.id);
  const [state, formAction, isPending] = useActionState(editarConId, undefined);

  const [selectedModuloId, setSelectedModuloId] = useState<number | "">(initialModuloId ?? "");
  const [selectedCategoriaId, setSelectedCategoriaId] = useState<number | "">(contenido.id_categoria);

  // Manejar cambio de módulo y reiniciar categoría seleccionada para evitar inconsistencias
  const handleModuloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? parseInt(e.target.value, 10) : "";
    setSelectedModuloId(val);
    setSelectedCategoriaId("");
  };

  // Filtrar categorías del módulo seleccionado (admitiendo la categoría actual del contenido para preservar datos históricos)
  const categoriasFiltradas = selectedModuloId
    ? categorias.filter(
        (c) => c.id_modulo === selectedModuloId && (c.activo || c.id === contenido.id_categoria)
      )
    : [];

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
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="id_modulo" className={styles.label}>
                Módulo <span className={styles.requiredTag}>*</span>
              </label>
              <select
                id="id_modulo"
                name="id_modulo"
                required
                value={selectedModuloId}
                onChange={handleModuloChange}
                className={styles.select}
              >
                <option value="">-- Seleccione un Módulo --</option>
                {modulos.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nombre} {!m.activo ? "(Inactivo)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="id_categoria" className={styles.label}>
                Categoría <span className={styles.requiredTag}>*</span>
              </label>
              <select
                id="id_categoria"
                name="id_categoria"
                required
                disabled={!selectedModuloId || categoriasFiltradas.length === 0}
                value={selectedCategoriaId}
                onChange={(e) => setSelectedCategoriaId(e.target.value ? parseInt(e.target.value, 10) : "")}
                className={styles.select}
                aria-describedby={selectedModuloId && categoriasFiltradas.length === 0 ? "categoria-vacia-hint" : undefined}
              >
                {!selectedModuloId ? (
                  <option value="">-- Primero seleccione un Módulo --</option>
                ) : categoriasFiltradas.length === 0 ? (
                  <option value="" disabled>
                    Este módulo no posee categorías activas disponibles
                  </option>
                ) : (
                  <>
                    <option value="">-- Seleccione una Categoría --</option>
                    {categoriasFiltradas.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre} {!c.activo ? "(Inactiva)" : ""}
                      </option>
                    ))}
                  </>
                )}
              </select>
              {selectedModuloId && categoriasFiltradas.length === 0 && (
                <span id="categoria-vacia-hint" className={styles.hint} role="status" style={{ color: "#d32f2f" }}>
                  El módulo seleccionado no cuenta con categorías activas disponibles.
                </span>
              )}
            </div>
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
              maxLength={200}
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
              maxLength={20000}
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
                maxLength={255}
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
                maxLength={50}
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
                maxLength={255}
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
                maxLength={255}
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
              maxLength={500}
              defaultValue={contenido.enlace || ""}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup} style={{ maxWidth: "220px" }}>
            <label htmlFor="orden" className={styles.label}>
              Orden de Despliegue <span className={styles.requiredTag}>*</span>
            </label>
            <input
              id="orden"
              name="orden"
              type="number"
              min={0}
              defaultValue={contenido.orden ?? 0}
              required
              className={styles.input}
            />
            <span className={styles.hint}>Posición numérica dentro de la categoría.</span>
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
