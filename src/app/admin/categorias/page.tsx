import React from "react";
import Link from "next/link";
import { verifySession } from "@/lib/dal";
import { getAllCategoriasAdmin, CategoriaAdmin } from "@/data/categorias";
import { AdminTable } from "@/components/admin/AdminTable";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { toggleActivoCategoriaAction } from "../actions/categorias-actions";
import styles from "../admin-form.module.css";
import tableStyles from "@/components/admin/AdminTable.module.css";

export const metadata = {
  title: "Gestión de Categorías - Panel Administrativo ACCEDER",
};

export default async function AdminCategoriasPage() {
  await verifySession();
  const categorias = await getAllCategoriasAdmin();

  const columns = [
    {
      header: "ID",
      accessor: "id" as keyof CategoriaAdmin,
      width: "70px",
    },
    {
      header: "Módulo",
      accessor: "modulo_nombre" as keyof CategoriaAdmin,
      width: "200px",
    },
    {
      header: "Nombre de la Categoría",
      accessor: "nombre" as keyof CategoriaAdmin,
    },
    {
      header: "Orden",
      accessor: "orden" as keyof CategoriaAdmin,
      width: "80px",
    },
    {
      header: "Estado",
      width: "140px",
      render: (c: CategoriaAdmin) => <StatusBadge activo={c.activo} />,
    },
    {
      header: "Acciones",
      width: "220px",
      render: (c: CategoriaAdmin) => {
        const toggleActionWithArgs = toggleActivoCategoriaAction.bind(null, c.id, c.activo);
        return (
          <div className={tableStyles.actionsCell}>
            <Link href={`/admin/categorias/${c.id}`} className={tableStyles.editBtn}>
              Editar
            </Link>
            <form action={toggleActionWithArgs} style={{ display: "inline" }}>
              <button
                type="submit"
                className={`${tableStyles.toggleBtn} ${
                  c.activo ? tableStyles.deactivateBtn : tableStyles.reactivateBtn
                }`}
                aria-label={`${c.activo ? "Desactivar" : "Reactivar"} categoría ${c.nombre}`}
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
          <h1 className={styles.pageTitle}>Gestión de Categorías</h1>
          <p className={styles.hint}>
            Las categorías clasifican los contenidos dentro de cada módulo. Al desactivar una categoría, sus contenidos asociados permanecen ocultos al público.
          </p>
        </div>
        <Link href="/admin/categorias/nuevo" className={styles.primaryBtn}>
          + Nueva Categoría
        </Link>
      </div>

      <AdminTable<CategoriaAdmin>
        columns={columns}
        data={categorias}
        keyExtractor={(c) => c.id}
        emptyMessage="No hay categorías registradas en la base de datos."
        isRowInactive={(c) => !c.activo}
      />
    </div>
  );
}
