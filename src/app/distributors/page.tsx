"use client";

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "/src/@/components/ui/table";
import { AppSidebar } from "/src/@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "/src/@/components/ui/breadcrumb";
import { Separator } from "/src/@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "/src/@/components/ui/sidebar";
import { api } from "../../services/api";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { DialogCreateDistributor } from "../../components/dialog-create-distributor";

interface Distributor {
  DISTRIBUTOR_ID: string;
  PLAN_TYPE: "pro" | "master" | "starter";
  ADDRESS: string;
  REGION: "norte" | "nordeste" | "centrooeste" | "sudeste" | "sul";
  POSTAL_CODE: string;
  LONGITUDE: number;
  LATITUDE: number;
  WHATSAPP_NUMBER: string;
  PHONE_NUMBER: string;
  EMAIL: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  CREATED_AT: Date;
  UPDATED_AT: Date;
}

export default function Page() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  useEffect(() => {
    function fetchDistributors() {
      api.get("/api/distributors").then((response) => {
        setDistributors(response.data);
      }).catch((error) => {
        console.error(error);
      });
    }
    fetchDistributors();
  }, []);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">AP Pro</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Distribuidores</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex-row flex items-center justify-end">
            <DialogCreateDistributor />
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min">
            <Table>
              <TableCaption>A lista de todos os seus distribuidores</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Primeiro Nome</TableHead>
                  <TableHead>Segundo Nome</TableHead>
                  <TableHead>Tipo de Plano</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Whatsapp</TableHead>
                  <TableHead>Endereço</TableHead>
                  <TableHead>CEP</TableHead>
                  <TableHead>Região</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {distributors.map((distributor: Distributor) => (
                  <TableRow key={distributor.DISTRIBUTOR_ID}>
                    <TableCell>{distributor.FIRST_NAME}</TableCell>
                    <TableCell>{distributor.LAST_NAME}</TableCell>
                    <TableCell>{distributor.PLAN_TYPE}</TableCell>
                    <TableCell>{distributor.EMAIL}</TableCell>
                    <TableCell>{distributor.PHONE_NUMBER}</TableCell>
                    <TableCell>{distributor.WHATSAPP_NUMBER}</TableCell>
                    <TableCell>{distributor.ADDRESS}</TableCell>
                    <TableCell>{distributor.POSTAL_CODE}</TableCell>
                    <TableCell>{distributor.REGION}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
