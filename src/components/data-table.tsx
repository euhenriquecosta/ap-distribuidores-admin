"use client"

import * as React from "react"
import { Button } from "/src/@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/@/components/ui/table"
import { Checkbox } from "/src/@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "/src/@/components/ui/dropdown-menu"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"
import { Input } from "./ui/input"
import { useURLState } from "../hooks/use-url-state"
import Image from "next/image"

interface Distributor {
  AVATAR: string | null
  DISTRIBUTOR_ID: string;
  PLAN_TYPE: "pro" | "master" | "starter";
  ADDRESS: string;
  WHATSAPP_NUMBER: string;
  PHONE_NUMBER: string;
  EMAIL: string;
  FIRST_NAME: string;
  LAST_NAME: string;
}

interface DataTableProps {
  data: Distributor[]
  onClickDelete: (id: string) => void
  onClickEdit: (id: string) => void
}

export function DataTable({ data: distributors, onClickDelete, onClickEdit }: DataTableProps) {
  const [selectedDistributors, setSelectedDistributors] = React.useState<Set<string>>(new Set())
  const [sortOrder, setSortOrder] = React.useState<{ column: string; direction: "asc" | "desc" }>({
    column: "firstName",
    direction: "asc",
  })
  const [searchQuery, setSearchQuery] = useURLState("q", "", encodeURIComponent, decodeURIComponent)

  const [currentPage, setCurrentPage] = React.useState(1)
  const itemsPerPage = 10

  function validateURL(url: string | null) {
    try {
      if (url !== null) {
        new URL(url);
        return true;
      } else {
        return false
      }
      // eslint-disable-next-line
    } catch (e) {
      return false;
    }
  }
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

  const filteredDistributors = distributors.filter((distributor) =>
    `${distributor.FIRST_NAME} ${distributor.LAST_NAME} ${distributor.EMAIL}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  )

  const sortedDistributors = [...filteredDistributors].sort((a, b) => {
    const aValue = a[sortOrder.column as keyof Distributor]
    const bValue = b[sortOrder.column as keyof Distributor]

    if (sortOrder.direction === "asc") {
      if (aValue === null || bValue === null) {
        return 0;
      }
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      if (aValue === null || bValue === null) {
        return 0;
      }
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })

  const totalPages = Math.ceil(sortedDistributors.length / itemsPerPage)
  const paginatedDistributors = sortedDistributors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  return (
    <div className="w-full">
      <div className="mb-4">
        <Input
          placeholder="Pesquisar por nome ou email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
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
                <Button variant="link" onClick={() => null}>
                  Avatar <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("FIRST_NAME")}>
                  Primeiro Nome <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("LAST_NAME")}>
                  Segundo Nome <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("PLAN_TYPE")}>
                  Tipo de Plano <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("EMAIL")}>
                  Email <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("PHONE_NUMBER")}>
                  Telefone <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("WHATSAPP_NUMBER")}>
                  Whatsapp <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="link" onClick={() => handleSort("ADDRESS")}>
                  Endereço <ArrowUpDown />
                </Button>
              </TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDistributors.length ? (
              paginatedDistributors.map((distributor) => (
                <TableRow key={distributor.DISTRIBUTOR_ID}>
                  <TableCell>
                    <Checkbox
                      checked={selectedDistributors.has(distributor.DISTRIBUTOR_ID)}
                      onCheckedChange={() => toggleDistributorSelection(distributor.DISTRIBUTOR_ID)}
                    />
                  </TableCell>
                  <TableCell className="justify-center p-10">
                    <Image src={validateURL(distributor.AVATAR) ? distributor.AVATAR! : "/avatar_fallback.png"} className="border border-gray-200 rounded-full" alt="Avatar" width={44} height={44} />
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
                        <DropdownMenuItem onClick={() => onClickDelete(distributor.DISTRIBUTOR_ID)}>
                          Excluir
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onClickEdit(distributor.DISTRIBUTOR_ID)}>
                          Editar
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
      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="flex items-center space-x-2 text-sm">
          <span>
            Página {currentPage} de {totalPages}
          </span>
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages || totalPages === 0}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  )
}