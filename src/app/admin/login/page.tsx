"use client";

import React, { useActionState } from "react";
import Link from "next/link";
import { loginAction, AuthState } from "../actions/auth-actions";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, undefined);

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <span className={styles.badge}>ACCEDER</span>
          <h1 className={styles.title}>Panel Administrativo</h1>
          <p className={styles.subtitle}>Inicie sesión para gestionar los recursos y contenidos</p>
        </div>

        {state?.error && (
          <div role="alert" className={styles.errorBanner}>
            {state.error}
          </div>
        )}

        <form action={formAction} className={styles.form} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className={styles.input}
              placeholder="nombre@ejemplo.gob.ar"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contrasenia" className={styles.label}>
              Contraseña
            </label>
            <input
              id="contrasenia"
              name="contrasenia"
              type="password"
              autoComplete="current-password"
              required
              className={styles.input}
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className={styles.submitBtn}
          >
            {isPending ? "Iniciando sesión..." : "Ingresar"}
          </button>
        </form>

        <div className={styles.backLinkContainer}>
          <Link href="/" className={styles.backLink}>
            ← Volver al portal público
          </Link>
        </div>
      </div>
    </div>
  );
}
