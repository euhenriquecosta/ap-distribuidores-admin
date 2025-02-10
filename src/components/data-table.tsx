"use client"

import * as React from "react"
import { Button } from "/src/@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/@/components/ui/table"
import { Checkbox } from "/src/@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "/src/@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"

interface Distributor {
  DISTRIBUTOR_ID: string;
  PLAN_TYPE: "pro" | "master" | "starter";
  ADDRESS: string;
  WHATSAPP_NUMBER: string;
  PHONE_NUMBER: string;
  EMAIL: string;
  FIRST_NAME: string;
  LAST_NAME: string;
}


// const distributorsData: Distributor[] = [
//   {
//     DISTRIBUTOR_ID: "1",
//     FIRST_NAME: "João",
//     LAST_NAME: "Silva",
//     PLAN_TYPE: "pro",
//     EMAIL: "joao@exemplo.com",
//     PHONE_NUMBER: "(11) 99999-9999",
//     WHATSAPP_NUMBER: "(11) 99999-9999",
//     ADDRESS: "Rua X, 123",
//   },
//   {
//     DISTRIBUTOR_ID: "2",
//     FIRST_NAME: "Maria",
//     LAST_NAME: "Oliveira",
//     PLAN_TYPE: "starter",
//     EMAIL: "maria@exemplo.com",
//     PHONE_NUMBER: "(11) 98888-8888",
//     WHATSAPP_NUMBER: "(11) 98888-8888",
//     ADDRESS: "Avenida Y, 456",
//   }
// ]

interface DataTableProps {
  data: Distributor[]
  onDelete: (id: string) => void
}

export function DataTable({ data: distributors, onDelete }: DataTableProps) {
  const [selectedDistributors, setSelectedDistributors] = React.useState<Set<string>>(new Set())
  const [sortOrder, setSortOrder] = React.useState<{ column: string; direction: "asc" | "desc" }>({
    column: "firstName",
    direction: "asc",
  })

  // const handleDeleteDistributor = (id: string) => {
  //   setDistributors((prevDistributors) =>
  //     prevDistributors.filter((distributor) => distributor.DISTRIBUTOR_ID !== id)
  //   )
  // }

  const toggleDistributorSelection = (id: string) => {
    setSelectedDistributors((prevSelected) => {
      const newSelected = new Set(prevSelected)
      if (newSelected.has(id)) {
        newSelected.delete(id)
      } else {
        newSelected.add(id)
      }
      return newSelected
    })
  }

  const handleSort = (column: string) => {
    setSortOrder((prev) => {
      const direction =
        prev.column === column && prev.direction === "asc" ? "desc" : "asc"
      return { column, direction }
    })
  }

  const sortedDistributors = [...distributors].sort((a, b) => {
    const aValue = a[sortOrder.column as keyof Distributor]
    const bValue = b[sortOrder.column as keyof Distributor]

    if (sortOrder.direction === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Checkbox
                  checked={selectedDistributors.size === distributors.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedDistributors(new Set(distributors.map((d) => d.DISTRIBUTOR_ID)))
                    } else {
                      setSelectedDistributors(new Set())
                    }
                  }}
                />
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("firstName")}>
                  Primeiro Nome <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("lastName")}>
                  Segundo Nome <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("planType")}>
                  Tipo de Plano <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("email")}>
                  Email <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("phone")}>
                  Telefone <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("whatsapp")}>
                  Whatsapp <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("address")}>
                  Endereço <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedDistributors.length ? (
              sortedDistributors.map((distributor) => (
                <TableRow key={distributor.DISTRIBUTOR_ID}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDistributors.has(distributor.DISTRIBUTOR_ID)}
                      onCheckedChange={() => toggleDistributorSelection(distributor.DISTRIBUTOR_ID)}
                    />
                  </TableCell>
                  <TableCell>{distributor.FIRST_NAME}</TableCell>
                  <TableCell>{distributor.LAST_NAME}</TableCell>
                  <TableCell>{distributor.PLAN_TYPE}</TableCell>
                  <TableCell>{distributor.EMAIL}</TableCell>
                  <TableCell>{distributor.PHONE_NUMBER}</TableCell>
                  <TableCell>{distributor.WHATSAPP_NUMBER}</TableCell>
                  <TableCell>{distributor.ADDRESS}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Abrir menu</span>
                          <MoreHorizontal />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => onDelete(distributor.DISTRIBUTOR_ID)}
                        >
                          Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center">
                  Nenhum distribuidor encontrado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}