import React from "react";
import { verifySession } from "@/lib/dal";
import { getModulosActivos } from "@/data/modulos";
import { getAllCategoriasAdmin } from "@/data/categorias";
import ContenidoCreateForm from "./ContenidoCreateForm";

export const metadata = {
  title: "Nuevo Contenido - Panel Administrativo ACCEDER",
};

export default async function NuevoContenidoPage() {
  await verifySession();
  const [modulos, allCategorias] = await Promise.all([
    getModulosActivos(),
    getAllCategoriasAdmin(),
  ]);

  // Solo se admiten categorías activas para la creación de nuevos contenidos
  const categoriasActivas = allCategorias.filter((c) => c.activo);

  return <ContenidoCreateForm modulos={modulos} categorias={categoriasActivas} />;
}
