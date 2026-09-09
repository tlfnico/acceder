import React from "react";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getContenidoByIdAdmin } from "@/data/contenidos";
import { getAllCategoriasAdmin } from "@/data/categorias";
import ContenidoEditForm from "./ContenidoEditForm";

interface EditContenidoPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Editar Contenido - Panel Administrativo ACCEDER",
};

export default async function EditContenidoPage({ params }: EditContenidoPageProps) {
  await verifySession();
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    notFound();
  }

  const [contenido, categorias] = await Promise.all([
    getContenidoByIdAdmin(id),
    getAllCategoriasAdmin(),
  ]);

  if (!contenido) {
    notFound();
  }

  return <ContenidoEditForm contenido={contenido} categorias={categorias} />;
}
