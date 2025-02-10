"use client";

// import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "/src/@/components/ui/table";
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
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

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

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      const fetchDistributors = () => {
        api.get("/api/distributors")
          .then((response) => {
            setDistributors(response.data);
          })
          .catch(console.error);
      };
      fetchDistributors();
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
    isLoading ? <div className="flex justify-center items-center"><Loading /></div> :
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
              <DialogCreateDistributor onCreate={async (id: string) => {
                const response = await api.get<Distributor>(`/api/distributors/${id}`);
                setDistributors((prevDistributors) => [...prevDistributors, response.data]);
              }} />
            </div>
            <div className="min-h-[100vh] flex-1 rounded-xl md:min-h-min lg:px-4 py-2">
              <DataTable data={distributors} onDelete={(id: string) => handleDelete(id)} />
              {/* <Table>
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
              </Table> */}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
  );
}
