import React from "react";
import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { getAllContenidosAdmin, ContenidoAdmin } from "@/data/contenidos";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toggleActivoContenidoAction } from "../actions/contenidos-actions";
import styles from "../admin-form.module.css";
import tableStyles from "@/components/admin/AdminTable.module.css";

export const metadata = {
  title: "Gestión de Contenidos - Panel Administrativo ACCEDER",
};

export default async function AdminContenidosPage() {
  await verifySession();
  const contenidos = await getAllContenidosAdmin();

  const columns = [
    {
      header: "ID",
      accessor: "id" as keyof ContenidoAdmin,
      width: "60px",
    },
    {
      header: "Título del Recurso",
      accessor: "titulo" as keyof ContenidoAdmin,
    },
    {
      header: "Módulo",
      accessor: "modulo_nombre" as keyof ContenidoAdmin,
      width: "180px",
    },
    {
      header: "Categoría",
      accessor: "categoria_nombre" as keyof ContenidoAdmin,
      width: "180px",
    },
    {
      header: "Estado",
      width: "130px",
      render: (c: ContenidoAdmin) => <StatusBadge activo={c.activo} />,
    },
    {
      header: "Acciones",
      width: "220px",
      render: (c: ContenidoAdmin) => {
        const toggleActionWithArgs = toggleActivoContenidoAction.bind(null, c.id, c.activo);
        return (
          <div className={tableStyles.actionsCell}>
            <Link href={`/admin/contenidos/${c.id}`} className={tableStyles.editBtn}>
              Editar
            </Link>
            <form action={toggleActionWithArgs} style={{ display: "inline" }}>
              <button
                type="submit"
                className={`${tableStyles.toggleBtn} ${
                  c.activo ? tableStyles.deactivateBtn : tableStyles.reactivateBtn
                }`}
                aria-label={`${c.activo ? "Desactivar" : "Reactivar"} contenido ${c.titulo}`}
              >
                {c.activo ? "Desactivar" : "Reactivar"}
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
          <h1 className={styles.pageTitle}>Gestión de Contenidos</h1>
          <p className={styles.hint}>
            Recursos y guías de trámites accesibles. Permite crear, modificar y cambiar el estado activo de cada publicación.
          </p>
        </div>
        <Link href="/admin/contenidos/nuevo" className={styles.primaryBtn}>
          + Nuevo Contenido
        </Link>
      </div>

      <AdminTable<ContenidoAdmin>
        columns={columns}
        data={contenidos}
        keyExtractor={(c) => c.id}
        emptyMessage="No hay contenidos registrados en la base de datos."
        isRowInactive={(c) => !c.activo}
      />
    </div>
  );
}
