import React from "react";
import { getSession } from "@/lib/session";
import { AdminHeader } from "@/components/admin/AdminHeader";
import styles from "./admin-layout.module.css";

export const metadata = {
  title: "Administración - ACCEDER",
  description: "Panel de administración del Recursero Digital de Accesibilidad",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Si no hay sesión (por ejemplo en /admin/login), se renderiza el contenido sin Header administrativo
  if (!session) {
    return <div className={styles.loginWrapper}>{children}</div>;
  }

  return (
    <div className={styles.adminWrapper}>
      <AdminHeader session={session} />
      <main className={styles.mainContainer} id="admin-main">
        {children}
      </main>
    </div>
  );
}
