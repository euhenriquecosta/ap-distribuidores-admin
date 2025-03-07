import React, { useState } from "react"
import { useForm } from "react-hook-form"
import { api } from "/src/@/services/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "/src/@/components/ui/dialog"
import { Button } from "/src/@/components/ui/button"
import { useToast } from "../hooks/use-toast"
import { DistributorForm } from "./distributor-form"
import { IFormData } from "../interfaces/form"

interface DialogCreateDistributorProps {
  onCreate: (id: string) => void
}

export function DialogCreateDistributor({ onCreate }: DialogCreateDistributorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { toast } = useToast()

  const form = useForm<IFormData>({
    defaultValues: {
      PLAN_TYPE: "starter",
      FIRST_NAME: "",
      LAST_NAME: "",
      EMAIL: "",
      PHONE_NUMBER: "",
      WHATSAPP_NUMBER: "",
      ADDRESS: "",
      LATITUDE: 0,
      LONGITUDE: 0,
    }
  })

  const onSubmit = async (data: IFormData) => {
    toast({
      variant: "default",
      title: "Criando distribuidor..."
    })
    try {
      setIsLoading(true);
      const response = await api.post("api/distributors", {
        ...data,
        PHONE_NUMBER: data.PHONE_NUMBER.replace(/\D/g, ""),
        WHATSAPP_NUMBER: data.WHATSAPP_NUMBER.replace(/\D/g, "")
      })
      if (response.status == 401) {
        toast({
          variant: "destructive",
          title: "Erro ao criar distribuidor",
          description: "Você não tem permissão para criar um novo distribuidor"
        })
      }
      if (response.status == 201) {
        toast({
          variant: "default",
          title: "Distribuidor criado",
          description: "O distribuidor foi criado com sucesso"
        })
        setIsOpen(false)
        onCreate(response.data.id)
      }
    } catch (error) {
      console.error("Erro ao criar distribuidor:", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar distribuidor",
        description: "Ocorreu um erro ao tentar criar um novo distribuidor"
      })
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild>
        <Button onClick={() => setIsOpen(true)} variant="default">Criar distribuidor</Button>
      </DialogTrigger>
      <DialogContent onClose={() => setIsOpen(false)} onCloseAutoFocus={() => setIsOpen(false)} className="table overflow-x-hidden justify-center items-center">
        <DialogHeader onAbort={() => setIsOpen(false)}>
          <DialogTitle>Criar distribuidor</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo distribuidor.
          </DialogDescription>
        </DialogHeader>
        <DistributorForm loading={isLoading} form={form} onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log(errors)

          const firstError = Object.values(errors)[0]

          if (firstError) {
            toast({
              variant: "destructive",
              title: "Erro ao Criar",
              description: firstError.message || "Verifique se todos os campos foram preenchidos corretamente",
            });
          }
        })} />
      </DialogContent>
    </Dialog>
  )
}