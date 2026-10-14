import React from "react";
import { notFound } from "next/navigation";
import { verifySession } from "@/lib/dal";
import { getContenidoByIdAdmin } from "@/data/contenidos";
import { getAllCategoriasAdmin } from "@/data/categorias";
import { getModulosActivos, getModuloByIdAdmin } from "@/data/modulos";
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

  const [contenido, modulos, categorias] = await Promise.all([
    getContenidoByIdAdmin(id),
    getModulosActivos(),
    getAllCategoriasAdmin(),
  ]);

  if (!contenido) {
    notFound();
  }

  // Determinar el módulo inicial a partir de la categoría del contenido
  const categoriaActual = categorias.find((c) => c.id === contenido.id_categoria);
  const initialModuloId = categoriaActual ? categoriaActual.id_modulo : undefined;

  // Si el módulo del contenido estuviera inactivo históricamente, se incluye para preservar la edición
  let modulosDisponibles = [...modulos];
  if (initialModuloId && !modulosDisponibles.some((m) => m.id === initialModuloId)) {
    const modActual = await getModuloByIdAdmin(initialModuloId);
    if (modActual) {
      modulosDisponibles.push(modActual);
    }
  }

  return (
    <ContenidoEditForm
      contenido={contenido}
      modulos={modulosDisponibles}
      categorias={categorias}
      initialModuloId={initialModuloId}
    />
  );
}
