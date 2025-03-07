"use client"

import { ChevronsUpDown, Check } from "lucide-react"
import { cn } from "/src/@/lib/utils"
import { Button } from "/src/@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "/src/@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "/src/@/components/ui/popover"
import { useState } from "react"

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

interface ComboBoxProps {
  options: Array<{
    value: string
    label: string
    data: Place
  }>
  value?: string | null
  onSelect: (value: string) => void
  searchTerm: string
  onSearch: (term: string) => void
  isLoading?: boolean
  placeholder: string
}

export function ComboBox({
  options,
  value,
  onSelect,
  searchTerm,
  onSearch,
  isLoading,
  placeholder
}: ComboBoxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between w-full"
        >
          {placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Pesquisar endereço..."
            value={searchTerm}
            onValueChange={onSearch}
          />
          <CommandList>
            {isLoading && (
              <div className="py-2 text-center text-sm">Buscando...</div>
            )}

            {!isLoading && options.length === 0 && (
              <CommandEmpty>Nenhum resultado encontrado</CommandEmpty>
            )}

            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onSelect(option.value)
                    setOpen(false)
                  }}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{option.label}</span>
                    {option.data.displayName.text && (
                      <span className="text-xs text-muted-foreground">
                        {option.data.displayName.text}
                      </span>
                    )}
                  </div>
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}