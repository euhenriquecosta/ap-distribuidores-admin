'use client'

import { useToast } from "../hooks/use-toast"
import { useForm } from "react-hook-form"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { DistributorForm } from "./distributor-form"

import { IFormData } from "../interfaces/form"
import { api } from "../services/api"
import { useEditDialogDistributor } from "../hooks/use-edit-dialog-distributor"
import { useEffect, useState } from "react"
import { Loading } from "./ui/loading"
import { parsePhoneNumber } from "react-phone-number-input"
import { Distributor } from "../contexts/auth-context"

interface DialogEditDistributorProps {
  onCreate: (data: Distributor) => void
}

export function DialogEditDistributor({ onCreate }: DialogEditDistributorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { isOpen, closeEditDialog, distributorId } = useEditDialogDistributor()

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
    try {
      setIsLoading(true)

      toast({
        variant: "default",
        title: "Editando distribuidor..."
      })

      const response = await api.put<Distributor>(`api/distributors/${distributorId}`, {
        ...data,
        PHONE_NUMBER: data.PHONE_NUMBER,
        WHATSAPP_NUMBER: data.WHATSAPP_NUMBER
      })
      if (response.status == 400) {
        toast({
          variant: "destructive",
          title: "Erro ao editar distribuidor",
          description: "Você não tem permissão para criar um novo distribuidor"
        })
      }
      if (response.status == 200) {
        toast({
          variant: "default",
          title: "Distribuidor editado",
          description: "O distribuidor foi editado com sucesso"
        })
        onCreate(response.data)
      }
      console.log(response.status)
    } catch (error) {
      console.error("Erro ao criar distribuidor:", error)
      toast({
        variant: "destructive",
        title: "Erro ao editar distribuidor",
        description: "Ocorreu um erro ao tentar editar um distribuidor"
      })
    } finally {
      closeEditDialog()
      setIsLoading(false)
    }
  }

  useEffect(() => {
    async function fetchDistributor() {
      try {
        setIsLoading(true)
        const response = await api.get<Distributor>(`/api/distributors/${distributorId}`)

        form.reset({
          ...response.data,
          PHONE_NUMBER: parsePhoneNumber(response.data.PHONE_NUMBER, "BR")?.number,
          WHATSAPP_NUMBER: parsePhoneNumber(response.data.WHATSAPP_NUMBER, "BR")?.number,
          ADDRESS: response.data.ADDRESS,
          AVATAR: response.data.AVATAR || null
        })
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchDistributor()
  }, [distributorId, form])

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <Dialog open={isOpen}>
      <DialogContent onClose={() => closeEditDialog()} className="table overflow-x-hidden justify-center items-center">
        <DialogHeader onAbort={() => closeEditDialog()}>
          <DialogTitle>Editar distribuidor</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para editar um distribuidor.
          </DialogDescription>
        </DialogHeader>
        <DistributorForm form={form} loading={isLoading} onSubmit={form.handleSubmit(onSubmit, (errors) => {
          console.log(errors)

          const firstError = Object.values(errors)[0]

          if (firstError) {
            toast({
              variant: "destructive",
              title: "Erro ao editar",
              description: firstError.message || "Verifique se todos os campos foram preenchidos corretamente",
            });
          }
        })} />
      </DialogContent>
    </Dialog>
  )
}