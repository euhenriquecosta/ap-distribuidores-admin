"use client"

import { Controller, UseFormReturn } from "react-hook-form"
import { useAddressSearch } from "../hooks/use-address-search"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select"
import { PhoneInput } from "./phone-input"
import { ComboBox } from "./combo-box"
import { Button } from "./ui/button"
import { IFormData } from "../interfaces/form"

type DistributorFormProps = {
  form: UseFormReturn<IFormData>;
  loading: boolean;
} & React.ComponentPropsWithoutRef<"form">; // Pega todas as propriedades nativas do <form>

export function DistributorForm({ form, loading, ...rest }: DistributorFormProps) {
  const { addressOptions, searchTerm, setSearchTerm } = useAddressSearch()
  const isEditForm = form.getValues("ADDRESS") !== "";
  const formType = isEditForm ? "Editar" : "Criar"

  const handleAddressSelect = (placeId: string) => {
    const selected = addressOptions.find(option => option.id === placeId)
    if (!selected) return

    form.reset(prev => ({
      ...prev,
      ADDRESS: selected.formattedAddress,
      LATITUDE: selected.location?.latitude,
      LONGITUDE: selected.location?.longitude
    }));
  }

  return (
    <form onSubmit={rest.onSubmit} className="flex flex-col gap-4" {...rest}>
      {/* Plano */}
      <div className="space-y-2">
        <Label>Plano</Label>
        <Controller
          name="PLAN_TYPE"
          control={form.control}
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="pro">Pro</SelectItem>
                <SelectItem value="master">Master</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Primeiro Nome */}
      <div className="space-y-2">
        <Label>Primeiro nome</Label>
        <Controller
          name="FIRST_NAME"
          control={form.control}
          render={({ field }) => <Input {...field} placeholder="Digite o primeiro nome" />}
        />
      </div>

      {/* Último Nome */}
      <div className="space-y-2">
        <Label>Último nome</Label>
        <Controller
          name="LAST_NAME"
          control={form.control}
          render={({ field }) => <Input {...field} placeholder="Digite o último nome" />}
        />
      </div>

      {/* WhatsApp */}
      <div className="space-y-2">
        <Label>Número do WhatsApp</Label>
        <Controller
          name="WHATSAPP_NUMBER"
          control={form.control}
          render={({ field }) => <PhoneInput {...field} placeholder="(00) 00000-0000" />}
        />
      </div>

      {/* Telefone */}
      <div className="space-y-2">
        <Label>Número de telefone</Label>
        <Controller
          name="PHONE_NUMBER"
          control={form.control}
          render={({ field }) => <PhoneInput {...field} placeholder="(00) 0000-0000" />}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label>E-mail</Label>
        <Controller
          name="EMAIL"
          control={form.control}
          render={({ field }) => <Input {...field} type="email" placeholder="email@exemplo.com" />}
        />
      </div>

      {/* Endereço */}
      <div className="space-y-2">
        <Label>Endereço</Label>
        <Controller
          name="ADDRESS"
          control={form.control}
          render={({ field }) => {
            return (
              <ComboBox
                options={addressOptions.map(option => ({
                  value: option.id,
                  label: option.formattedAddress,
                  data: option
                }))}
                value={field.value}
                placeholder={field.value ? field.value : "Selecione um endereço..."}
                onSelect={(value) => {
                  field.onChange(value);
                  handleAddressSelect(value);
                }}
                searchTerm={searchTerm}
                onSearch={setSearchTerm}
              />
            );
          }}
        />
      </div>

      <Button type="submit" disabled={loading}>{formType} Distribuidor</Button>
    </form>
  )
}