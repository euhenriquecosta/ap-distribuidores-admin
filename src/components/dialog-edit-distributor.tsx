'use client'

import { useToast } from "../hooks/use-toast"
import { useForm } from "react-hook-form"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog"
import { DistributorForm } from "./distributor-form"
import { IFormData } from "../interfaces/form"
import { api } from "../services/api"
import { useEditDialogDistributor } from "../hooks/use-edit-dialog-distributor"
import { useCallback, useEffect, useState } from "react"
import { Loading } from "./ui/loading"
import { parsePhoneNumber } from "react-phone-number-input"
import { Distributor } from "../contexts/auth-context"
import { AxiosError } from "axios"
import { FieldErrors } from "react-hook-form"

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

interface DialogEditDistributorProps {
  onCreate: (data: Distributor) => void
}

type ToastType = "success" | "error" | "loading";

export function DialogEditDistributor({ onCreate }: DialogEditDistributorProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isFormLoading, setIsFormLoading] = useState(false)
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
      AVATAR: null
    }
  })

  const showToast = useCallback((type: ToastType, title: string, description?: string) => {
    toast({
      variant: type === "error" ? "destructive" : "default",
      title,
      description
    })
  }, [toast])

  const onSubmit = async (data: IFormData) => {
    try {
      setIsFormLoading(true)
      showToast("loading", "Editando distribuidor...")

      const response = await api.put<Distributor>(`api/distributors/${distributorId}`, {
        PLAN_TYPE: data.PLAN_TYPE,
        ADDRESS: data.ADDRESS,
        FIRST_NAME: data.FIRST_NAME,
        LAST_NAME: data.LAST_NAME,
        EMAIL: data.EMAIL,
        LATITUDE: data.LATITUDE,
        LONGITUDE: data.LONGITUDE,
        PHONE_NUMBER: data.PHONE_NUMBER,
        WHATSAPP_NUMBER: data.WHATSAPP_NUMBER
      } as Distributor)

      // Avatar upload handling
      let updatedDistributor = response.data;

      if (data.AVATAR) {
        const formData = new FormData()
        formData.append('AVATAR', data.AVATAR);

        try {
          interface AvatarUploadResponse {
            AVATAR?: string;
          }

          const uploadResponse = await api.post<AvatarUploadResponse>(
            `/api/distributor/upload/avatar/${distributorId}`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' } }
          )

          if (uploadResponse.data?.AVATAR) {
            updatedDistributor = {
              ...updatedDistributor,
              AVATAR: uploadResponse.data.AVATAR
            }
          }
        } catch (error) {
          console.error(error)
          showToast(
            "error",
            "Erro ao fazer upload da imagem",
            "O distribuidor foi atualizado, mas houve um problema ao atualizar a imagem"
          )
        }
      }

      showToast(
        "success",
        "Distribuidor editado",
        "O distribuidor foi editado com sucesso"
      )

      onCreate(updatedDistributor)
      closeEditDialog()
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage = axiosError.response?.data?.message ||
        axiosError.response?.data?.error ||
        "Ocorreu um erro ao tentar editar um distribuidor";

      if (axiosError.response?.status === 400) {
        showToast("error", "Erro ao editar distribuidor", "Você não tem permissão para editar este distribuidor")
      } else if (axiosError.response?.status === 401) {
        showToast("error", "Não autorizado", "Você não tem permissão para realizar esta ação")
      } else {
        showToast("error", "Erro ao editar distribuidor", errorMessage)
      }
    } finally {
      setIsFormLoading(false)
    }
  }

  const handleFormError = (errors: FieldErrors<IFormData>) => {
    const firstErrorEntry = Object.entries(errors)[0];

    if (firstErrorEntry) {
      const [field, error] = firstErrorEntry;
      showToast(
        "error",
        `Erro no campo ${field}`,
        error.message || "Verifique se todos os campos foram preenchidos corretamente"
      )
    }
  }

  useEffect(() => {
    if (!distributorId || !isOpen) return;

    async function fetchDistributor() {
      try {
        setIsLoading(true)
        const response = await api.get<Distributor>(`/api/distributors/${distributorId}`)

        // Format phone numbers safely
        const formatPhoneNumber = (phoneNumber: string): string => {
          try {
            const parsed = parsePhoneNumber(phoneNumber, "BR");
            return parsed?.number || phoneNumber;
          } catch {
            return phoneNumber;
          }
        };

        form.reset({
          ...response.data,
          PHONE_NUMBER: formatPhoneNumber(response.data.PHONE_NUMBER),
          WHATSAPP_NUMBER: formatPhoneNumber(response.data.WHATSAPP_NUMBER),
          ADDRESS: response.data.ADDRESS || "",
          AVATAR: response.data.AVATAR || null
        })
      } catch (error) {
        console.error(error)
        showToast(
          "error",
          "Erro ao carregar dados",
          "Não foi possível carregar os dados do distribuidor"
        )
        closeEditDialog()
      } finally {
        setIsLoading(false)
      }
    }

    fetchDistributor()
  }, [distributorId, isOpen, form, closeEditDialog, showToast])

  const handleClose = () => {
    if (!isFormLoading) {
      closeEditDialog()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="table overflow-x-hidden justify-center items-center">
        <DialogHeader>
          <DialogTitle>Editar distribuidor</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para editar um distribuidor.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loading />
          </div>
        ) : (
          <DistributorForm
            form={form}
            loading={isFormLoading}
            onSubmit={form.handleSubmit(onSubmit, handleFormError)}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}