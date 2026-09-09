import React from "react";
import { requireAdmin } from "@/lib/dal";
import { getRoles } from "@/data/usuarios";
import UsuarioCreateForm from "./UsuarioCreateForm";

export const metadata = {
  title: "Nuevo Usuario - Panel Administrativo ACCEDER",
};

export default async function NuevoUsuarioPage() {
  await requireAdmin();
  const roles = await getRoles();

  return <UsuarioCreateForm roles={roles} />;
}
