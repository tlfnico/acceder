"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { Rol, UsuarioSeguro } from "@/lib/types";
import { editarUsuarioAction, UsuarioFormState } from "../../actions/usuarios-actions";
import styles from "../../admin-form.module.css";

interface UsuarioEditFormProps {
  usuario: UsuarioSeguro;
  roles: Rol[];
}

export default function UsuarioEditForm({ usuario, roles }: UsuarioEditFormProps) {
  const editarConId = editarUsuarioAction.bind(null, usuario.id);
  const [state, formAction, isPending] = useActionState(editarConId, undefined);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>
          Editar Usuario: {usuario.nombre} {usuario.apellido}
        </h1>
        <Link href="/admin/usuarios" className={styles.secondaryBtn}>
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
              <label htmlFor="nombre" className={styles.label}>
                Nombre <span className={styles.requiredTag}>*</span>
              </label>
              <input
                id="nombre"
                name="nombre"
                type="text"
                required
                defaultValue={usuario.nombre}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="apellido" className={styles.label}>
                Apellido <span className={styles.requiredTag}>*</span>
              </label>
              <input
                id="apellido"
                name="apellido"
                type="text"
                required
                defaultValue={usuario.apellido}
                className={styles.input}
              />
            </div>
          </div>

          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>
                Correo Electrónico <span className={styles.requiredTag}>*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                defaultValue={usuario.email}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="id_rol" className={styles.label}>
                Rol Asignado <span className={styles.requiredTag}>*</span>
              </label>
              <select
                id="id_rol"
                name="id_rol"
                required
                defaultValue={usuario.id_rol}
                className={styles.select}
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.nombre === "ADMINISTRADOR"
                      ? "ADMINISTRADOR (Acceso total)"
                      : "PERSONAL_ACCESIBILIDAD (Gestión de contenidos)"}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contrasenia" className={styles.label}>
              Nueva Contraseña (Opcional)
            </label>
            <input
              id="contrasenia"
              name="contrasenia"
              type="password"
              minLength={6}
              className={styles.input}
              placeholder="Dejar en blanco para mantener la contraseña actual"
            />
            <span className={styles.hint}>
              Complete este campo únicamente si desea restablecer la contraseña de este usuario.
            </span>
          </div>

          <div className={styles.checkboxGroup}>
            <input
              type="checkbox"
              id="activo"
              name="activo"
              defaultChecked={usuario.activo}
              className={styles.checkbox}
            />
            <label htmlFor="activo" className={styles.checkboxLabel}>
              Usuario Activo (Permite iniciar sesión en el panel)
            </label>
          </div>

          {!usuario.activo && (
            <div className={styles.warningBanner}>
              ⚠️ <strong>Atención:</strong> Al estar inactivo, este usuario no podrá iniciar sesión en el panel de administración.
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
            <Link href="/admin/usuarios" className={styles.secondaryBtn}>
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
