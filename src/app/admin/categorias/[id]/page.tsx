import React from "react";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getCategoriaByIdAdmin } from "@/data/categorias";
import { getAllModulosAdmin } from "@/data/modulos";
import CategoriaEditForm from "./CategoriaEditForm";

interface EditCategoriaPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Editar Categoría - Panel Administrativo ACCEDER",
};

export default async function EditCategoriaPage({ params }: EditCategoriaPageProps) {
  await verifySession();
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    notFound();
  }

  const [categoria, modulos] = await Promise.all([
    getCategoriaByIdAdmin(id),
    getAllModulosAdmin(),
  ]);

  if (!categoria) {
    notFound();
  }

  return <CategoriaEditForm categoria={categoria} modulos={modulos} />;
}
