import React from "react";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/dal";
import { getUsuarioById, getRoles } from "@/data/usuarios";
import UsuarioEditForm from "./UsuarioEditForm";

interface EditUsuarioPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = {
  title: "Editar Usuario - Panel Administrativo ACCEDER",
};

export default async function EditUsuarioPage({ params }: EditUsuarioPageProps) {
  await requireAdmin();
  const { id: idStr } = await params;
  const id = parseInt(idStr, 10);

  if (isNaN(id)) {
    notFound();
  }

  const [usuario, roles] = await Promise.all([
    getUsuarioById(id),
    getRoles(),
  ]);

  if (!usuario) {
    notFound();
  }

  return <UsuarioEditForm usuario={usuario} roles={roles} />;
}
