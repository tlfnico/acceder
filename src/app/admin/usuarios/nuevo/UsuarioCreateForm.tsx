"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { Rol } from "@/lib/types";
import { crearUsuarioAction, UsuarioFormState } from "../../actions/usuarios-actions";
import styles from "../../admin-form.module.css";

interface UsuarioCreateFormProps {
  roles: Rol[];
}

export default function UsuarioCreateForm({ roles }: UsuarioCreateFormProps) {
  const [state, formAction, isPending] = useActionState(crearUsuarioAction, undefined);

  return (
    <div>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Crear Nuevo Usuario</h1>
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
                className={styles.input}
                placeholder="Ej: María"
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
                className={styles.input}
                placeholder="Ej: González"
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
                className={styles.input}
                placeholder="Ej: mgonzalez@acceder.gob.ar"
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
                defaultValue=""
                className={styles.select}
              >
                <option value="" disabled>
                  -- Seleccione un Rol --
                </option>
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
              Contraseña Inicial <span className={styles.requiredTag}>*</span>
            </label>
            <input
              id="contrasenia"
              name="contrasenia"
              type="password"
              required
              minLength={6}
              className={styles.input}
              placeholder="Mínimo 6 caracteres"
            />
            <span className={styles.hint}>
              La contraseña se almacenará de manera segura mediante cifrado hash con bcryptjs.
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
              Usuario Activo (Permite iniciar sesión en el panel)
            </label>
          </div>

          <div className={styles.formActions}>
            <button
              type="submit"
              disabled={isPending}
              className={styles.primaryBtn}
            >
              {isPending ? "Guardando..." : "Guardar Usuario"}
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
