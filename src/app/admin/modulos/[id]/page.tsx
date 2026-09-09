import React from "react";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getModuloByIdAdmin } from "@/data/modulos";
import ModuloEditForm from "./ModuloEditForm";

interface EditModuloPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Editar Módulo - Panel Administrativo ACCEDER",
};

export default async function EditModuloPage({ params }: EditModuloPageProps) {
  await verifySession();
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    notFound();
  }

  const modulo = await getModuloByIdAdmin(id);
  if (!modulo) {
    notFound();
  }

  return <ModuloEditForm modulo={modulo} />;
}
