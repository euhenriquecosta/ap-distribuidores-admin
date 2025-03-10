"use client";

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
import { DialogCreateDistributor } from "../../components/dialog-create-distributor";
import { useAuth } from "../../hooks/use-auth";
import { useRouter } from "next/navigation";
import { Loading } from "../../components/ui/loading";
import { DataTable } from "../../components/data-table";
import { useEditDialogDistributor } from "../../hooks/use-edit-dialog-distributor";
import { DialogEditDistributor } from "../../components/dialog-edit-distributor";
import { useDialogConfirm } from "../../hooks/use-dialog-confirm";

interface Distributor {
  DISTRIBUTOR_ID: string;
  AVATAR: string | null;
  PLAN_TYPE: "pro" | "master" | "starter";
  ADDRESS: string;
  LATITUDE: number;
  LONGITUDE: number;
  WHATSAPP_NUMBER: string;
  PHONE_NUMBER: string;
  FIRST_NAME: string;
  LAST_NAME: string;
  EMAIL: string;
  CREATED_AT: Date;
  UPDATED_AT: Date;
}

export default function Page() {
  const [distributors, setDistributors] = useState<Distributor[]>([]);

  const { openEditDialog } = useEditDialogDistributor()
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const { open } = useDialogConfirm()


  // TODO: Nesse handle delete vai ser necessário abrir um dialog para confirmar a exclusão do distribuidor
  async function handleDelete(id: string) {
    try {
      const response = await api.delete(`/api/distributors/${id}`);
      if (response.status === 200) {
        setDistributors((prevDistributors) =>
          prevDistributors.filter((distributor) => distributor.DISTRIBUTOR_ID !== id)
        );
      }
    } catch (error) {
      console.error(error);
      throw new Error("Erro ao deletar distribuidor");
    }
  }

  async function handleCreate(id: string) {
    const response = await api.get<Distributor>(`/api/distributors/${id}`);
    setDistributors((prevDistributors) => [...prevDistributors, response.data]);
  }

  // TODO: Nesse handle edit vai ser necessário abir um dialog para editar o distribuidor
  async function handleEdit(data: Distributor) {
    setDistributors((prevDistributors) =>
      prevDistributors.map((distributor) =>
        distributor.DISTRIBUTOR_ID === data.DISTRIBUTOR_ID ? data : distributor
      )
    );
  }

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      api.get("/api/distributors")
        .then((response) => {
          setDistributors(response.data);
        })
        .catch(console.error);
    }
  }, [isAuthenticated, isLoading]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <DialogEditDistributor onCreate={(distributor: Distributor) => handleEdit(distributor)} />
      <SidebarInset className="px-5 overflow-x-hidden">
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
        <div className="flex flex-1 flex-col gap-4 py-4 pt-0">
          <div className="flex items-center justify-between px-4">
            <h1 className="text-lg font-semibold">Distribuidores</h1>
            <DialogCreateDistributor onCreate={(id) => handleCreate(id)} />
          </div>
          <div className="min-h-[calc(100vh-150px)] flex-1 rounded-xl md:min-h-min lg:px-4 py-2">
            <DataTable data={distributors} onClickDelete={() => open("Confirmar Exclusão", "Tem certeza que deseja excluir este item?", () => handleDelete)} onClickEdit={(id) => openEditDialog(id)} />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}