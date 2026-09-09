import React from "react";
import { verifySession } from "@/lib/dal";
import { getAllCategoriasAdmin } from "@/data/categorias";
import ContenidoCreateForm from "./ContenidoCreateForm";

export const metadata = {
  title: "Nuevo Contenido - Panel Administrativo ACCEDER",
};

export default async function NuevoContenidoPage() {
  await verifySession();
  const categorias = await getAllCategoriasAdmin();

  return <ContenidoCreateForm categorias={categorias} />;
}
