import React, { useState } from "react"
import { useForm, Controller } from "react-hook-form"
import { useDebounce } from "use-debounce"
import { api } from "/src/@/services/api"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "/src/@/components/ui/dialog"
import { Button } from "/src/@/components/ui/button"
import { Input } from "/src/@/components/ui/input"
import { Label } from "/src/@/components/ui/label"
import { PhoneInput } from "./phone-input"
import { ComboBox } from "./combo-box"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./ui/select"
import { useToast } from "../hooks/use-toast"

type PlanType = "starter" | "pro" | "master"

interface AddressComponent {
  longText?: string
  shortText?: string
  types: string[]
  languageCode: string
}

interface Place {
  id: string
  formattedAddress: string
  addressComponents: AddressComponent[]
  displayName: {
    text: string
    languageCode: string
  }
  location?: {
    latitude: number
    longitude: number
  }
}

interface FormData {
  PLAN_TYPE: PlanType
  FIRST_NAME: string
  LAST_NAME: string
  EMAIL: string
  PHONE_NUMBER: string
  WHATSAPP_NUMBER: string
  ADDRESS: string
  LATITUDE: number
  LONGITUDE: number
}


export function DialogCreateDistributor() {
  const [addressOptions, setAddressOptions] = useState<Array<{
    value: string
    label: string
    data: Place
  }>>([])
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedTerm] = useDebounce(searchTerm, 300)
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null)
  const { control, handleSubmit, setValue } = useForm<FormData>({
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

  const fetchAddressPredictions = async (term: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(
        "https://places.googleapis.com/v1/places:searchText",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Goog-Api-Key": "AIzaSyATFFlBVvbstEAytcAChHNX73TIrsFmGzU",
            "X-Goog-FieldMask": "places.id,places.formattedAddress,places.location,places.addressComponents,places.displayName"
          },
          body: JSON.stringify({ textQuery: term })
        }
      )

      const data = await response.json()
      setAddressOptions(data.places?.map((place: Place) => ({
        value: place.id,
        label: place.formattedAddress,
        data: place
      })) || [])
    } catch (error) {
      console.error("Erro na busca de endereços:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddressSelect = (placeId: string) => {
    setSelectedPlaceId(placeId)

    const selected = addressOptions.find(opt => opt.value === placeId)
    if (!selected?.data.addressComponents) return

    setValue("ADDRESS", selected.data.formattedAddress)
    setValue("LATITUDE", selected.data.location?.latitude || 0)
    setValue("LONGITUDE", selected.data.location?.longitude || 0)
  }

  const onSubmit = async (data: FormData) => {
    toast({
      variant: "default",
      title: "Criando distribuidor..."
    })
    try {
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
      }
    } catch (error) {
      console.error("Erro ao criar distribuidor:", error)
      toast({
        variant: "destructive",
        title: "Erro ao criar distribuidor",
        description: "Ocorreu um erro ao tentar criar um novo distribuidor"
      })
    }
  }

  React.useEffect(() => {
    if (debouncedTerm.length >= 3) {
      fetchAddressPredictions(debouncedTerm)
    } else {
      setAddressOptions([])
    }
  }, [debouncedTerm])

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Criar distribuidor</Button>
      </DialogTrigger>
      <DialogContent className="table overflow-x-hidden justify-center items-center">
        <DialogHeader>
          <DialogTitle>Criar distribuidor</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para criar um novo distribuidor.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-4 py-4 max-h-[70vh] overflow-y-auto px-2">
            {/* Plano */}
            <div className="space-y-2">
              <Label>Plano</Label>
              <Controller
                name="PLAN_TYPE"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um plano" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Planos</SelectLabel>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="pro">Pro</SelectItem>
                        <SelectItem value="master">Master</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Nome */}
            <div className="space-y-2">
              <Label>Primeiro nome</Label>
              <Controller
                name="FIRST_NAME"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Digite o primeiro nome" />
                )}
              />
            </div>

            {/* Sobrenome */}
            <div className="space-y-2">
              <Label>Último nome</Label>
              <Controller
                name="LAST_NAME"
                control={control}
                render={({ field }) => (
                  <Input {...field} placeholder="Digite o último nome" />
                )}
              />
            </div>

            {/* WhatsApp */}
            <div className="space-y-2">
              <Label>Número do WhatsApp</Label>
              <Controller
                name="WHATSAPP_NUMBER"
                control={control}
                render={({ field }) => (
                  <PhoneInput {...field} placeholder="(00) 00000-0000" />
                )}
              />
            </div>

            {/* Telefone */}
            <div className="space-y-2">
              <Label>Número de telefone</Label>
              <Controller
                name="PHONE_NUMBER"
                control={control}
                render={({ field }) => (
                  <PhoneInput {...field} placeholder="(00) 0000-0000" />
                )}
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label>E-mail</Label>
              <Controller
                name="EMAIL"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="email"
                    placeholder="email@exemplo.com"
                  />
                )}
              />
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <Label>Endereço</Label>
              <ComboBox
                options={addressOptions}
                value={selectedPlaceId}
                onSelect={handleAddressSelect}
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
                isLoading={isLoading}
              />
            </div>

            {/* Campos ocultos */}
            <Controller name="LATITUDE" control={control} render={({ field }) => <input type="hidden" {...field} />} />
            <Controller name="LONGITUDE" control={control} render={({ field }) => <input type="hidden" {...field} />} />
          </div>

          <DialogFooter>
            <Button type="submit" className="w-full">
              Criar distribuidor
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}