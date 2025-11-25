"use client";
import { Candidate } from "@/app/generated/prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export const CandidatesColumns: ColumnDef<Candidate>[] = [
  {
    header: "Nombre",
    accessorKey: "nombre",
    cell: ({ row }) => (
      <div className="font-medium truncate">{row.getValue("nombre")}</div>
    ),
    size: 20,
  },
  {
    header: "Municipio/Alcandia",
    accessorKey: "municipioAlcaldia",
    cell: ({ row }) => (
      <div className="text-sm truncate">
        {row.getValue("municipioAlcaldia")}
      </div>
    ),
    size: 25,
  },
  {
    header: "Ciudad",
    accessorKey: "ciudad",
    cell: ({ row }) => (
      <div className="text-sm truncate">{row.getValue("ciudad")}</div>
    ),
    size: 15,
  },
  {
    header: "Telefono",
    accessorKey: "telefono",
    cell: ({ row }) => {
      return <div>{row.getValue("telefono")}</div>;
    },
    size: 8,
  },
  {
    header: "Correo",
    accessorKey: "correo",
    cell: ({ row }) => {
      return <div className="text-sm truncate">{row.getValue("correo")}</div>;
    },
    size: 10,
  },
  {
    header: "Sector Experiencia",
    accessorKey: "ultimoSector",
    cell: ({ row }) => {
      const ultimoSector = row.original.ultimoSector;

      return <div className="text-sm truncate">{ultimoSector}</div>;
    },
    size: 10,
  },
  {
    header: "Ultima Posicion",
    accessorKey: "ultimoPuesto",
    cell: ({ row }) => {
      const ultimoPuesto = row.original.ultimoPuesto;

      return <div className="text-sm truncate">{ultimoPuesto}</div>;
    },
    size: 10,
  },

  {
    header: "Puesto Interes",
    accessorKey: "puestoInteres",
    cell: ({ row }) => {
      const puestoInteres = row.original.puestoInteres;

      return <div className="text-sm truncate">{puestoInteres}</div>;
    },
    size: 10,
  },
  {
    header: "Salario Deseado",
    accessorKey: "salarioDeseado",
    cell: ({ row }) => {
      const salario_deseado = row.original.salarioDeseado;

      return <div className="text-sm truncate">{salario_deseado}</div>;
    },
    size: 10,
  },

  {
    header: "Titulado",
    accessorKey: "titulado",
    cell: ({ row }) => {
      const titulado = row.original.titulado ? "Si" : "No";

      return <div className="text-sm truncate">{titulado}</div>;
    },
    size: 10,
  },

  {
    header: "Nivel de Ingles",
    accessorKey: "ingles",
    cell: ({ row }) => {
      return <div className="text-sm truncate">{row.getValue("ingles")}</div>;
    },
    size: 10,
  },
];
