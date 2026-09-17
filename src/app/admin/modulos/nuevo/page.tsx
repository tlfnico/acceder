import React from "react";
import { verifySession } from "@/lib/dal";
import ModuloCreateForm from "./ModuloCreateForm";

export const metadata = {
  title: "Nuevo Módulo - Panel Administrativo ACCEDER",
};

export default async function NuevoModuloPage() {
  await verifySession();

  return <ModuloCreateForm />;
}
