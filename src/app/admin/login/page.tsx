import React from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import AdminLoginForm from "./AdminLoginForm";

export const metadata = {
  title: "Iniciar Sesión - Panel Administrativo ACCEDER",
};

export default async function AdminLoginPage() {
  const session = await getSession();

  // Si el usuario ya cuenta con sesión activa, redirigir directamente al panel
  if (session?.userId) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
