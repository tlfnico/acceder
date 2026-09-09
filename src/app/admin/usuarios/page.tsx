import React from "react";
import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { getUsuariosAdmin } from "@/data/usuarios";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toggleActivoUsuarioAction } from "../actions/usuarios-actions";
import { UsuarioSeguro } from "@/lib/types";
import styles from "../admin-form.module.css";
import tableStyles from "@/components/admin/AdminTable.module.css";

export const metadata = {
  title: "Gestión de Usuarios - Panel Administrativo ACCEDER",
};

export default async function AdminUsuariosPage() {
  const session = await requireAdmin();
  const usuarios = await getUsuariosAdmin();

  const columns = [
    {
      header: "ID",
      accessor: "id" as keyof UsuarioSeguro,
      width: "60px",
    },
    {
      header: "Nombre Completo",
      render: (u: UsuarioSeguro) => `${u.nombre} ${u.apellido}`,
    },
    {
      header: "Correo Electrónico",
      accessor: "email" as keyof UsuarioSeguro,
    },
    {
      header: "Rol",
      accessor: "rol_nombre" as keyof UsuarioSeguro,
      width: "200px",
    },
    {
      header: "Estado",
      width: "130px",
      render: (u: UsuarioSeguro) => <StatusBadge activo={u.activo} />,
    },
    {
      header: "Acciones",
      width: "220px",
      render: (u: UsuarioSeguro) => {
        const toggleActionWithArgs = toggleActivoUsuarioAction.bind(null, u.id, u.activo);
        const isCurrentSelf = u.id === session.userId;
        return (
          <div className={tableStyles.actionsCell}>
            <Link href={`/admin/usuarios/${u.id}`} className={tableStyles.editBtn}>
              Editar
            </Link>
            {!isCurrentSelf ? (
              <form action={toggleActionWithArgs} style={{ display: "inline" }}>
                <button
                  type="submit"
                  className={`${tableStyles.toggleBtn} ${
                    u.activo ? tableStyles.deactivateBtn : tableStyles.reactivateBtn
                  }`}
                  aria-label={`${u.activo ? "Desactivar" : "Reactivar"} usuario ${u.nombre}`}
                >
                  {u.activo ? "Desactivar" : "Reactivar"}
                </button>
              </form>
            ) : (
              <span style={{ fontSize: "0.8rem", color: "#666" }}>(Tu usuario)</span>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gestión de Usuarios</h1>
          <p className={styles.hint}>
            Cuentas autorizadas para operar en el panel administrativo. Sección accesible exclusivamente para Administradores.
          </p>
        </div>
        <Link href="/admin/usuarios/nuevo" className={styles.primaryBtn}>
          + Nuevo Usuario
        </Link>
      </div>

      <AdminTable<UsuarioSeguro>
        columns={columns}
        data={usuarios}
        keyExtractor={(u) => u.id}
        emptyMessage="No hay usuarios registrados en la base de datos."
        isRowInactive={(u) => !u.activo}
      />
    </div>
  );
}
