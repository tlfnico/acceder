import React from "react";
import { verifySession } from "@/lib/dal";
import { getAllModulosAdmin } from "@/data/modulos";
import CategoriaCreateForm from "./CategoriaCreateForm";

export const metadata = {
  title: "Nueva Categoría - Panel Administrativo ACCEDER",
};

export default async function NuevaCategoriaPage() {
  await verifySession();
  const modulos = await getAllModulosAdmin();

  return <CategoriaCreateForm modulos={modulos} />;
}
