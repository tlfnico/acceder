import React from "react";
import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { getAllModulosAdmin } from "@/data/modulos";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toggleActivoModuloAction } from "../actions/modulos-actions";
import { Modulo } from "@/lib/types";
import styles from "../admin-form.module.css";
import tableStyles from "@/components/admin/AdminTable.module.css";

export const metadata = {
  title: "Gestión de Módulos - Panel Administrativo ACCEDER",
};

export default async function AdminModulosPage() {
  await verifySession();
  const modulos = await getAllModulosAdmin();

  const columns = [
    {
      header: "ID",
      accessor: "id" as keyof Modulo,
      width: "80px",
    },
    {
      header: "Nombre del Módulo",
      accessor: "nombre" as keyof Modulo,
    },
    {
      header: "Orden",
      accessor: "orden" as keyof Modulo,
      width: "100px",
    },
    {
      header: "Estado",
      width: "140px",
      render: (m: Modulo) => <StatusBadge activo={m.activo} />,
    },
    {
      header: "Acciones",
      width: "220px",
      render: (m: Modulo) => {
        const toggleActionWithArgs = toggleActivoModuloAction.bind(null, m.id, m.activo);
        return (
          <div className={tableStyles.actionsCell}>
            <Link href={`/admin/modulos/${m.id}`} className={tableStyles.editBtn}>
              Editar
            </Link>
            <form action={toggleActionWithArgs} style={{ display: "inline" }}>
              <button
                type="submit"
                className={`${tableStyles.toggleBtn} ${
                  m.activo ? tableStyles.deactivateBtn : tableStyles.reactivateBtn
                }`}
                aria-label={`${m.activo ? "Desactivar" : "Reactivar"} módulo ${m.nombre}`}
              >
                {m.activo ? "Desactivar" : "Reactivar"}
              </button>
            </form>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Gestión de Módulos</h1>
          <p className={styles.hint}>
            Los módulos organizan las áreas temáticas del portal. La desactivación de un módulo oculta sus categorías asociadas en el portal público.
          </p>
        </div>
        <Link href="/admin/modulos/nuevo" className={styles.primaryBtn}>
          + Nuevo Módulo
        </Link>
      </div>

      <AdminTable<Modulo>
        columns={columns}
        data={modulos}
        keyExtractor={(m) => m.id}
        emptyMessage="No hay módulos registrados en la base de datos."
        isRowInactive={(m) => !m.activo}
      />
    </div>
  );
}
