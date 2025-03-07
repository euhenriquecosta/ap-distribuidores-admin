import { useState, useEffect } from "react"
import { useDebounce } from "use-debounce"

import { IPlace, IPlaceSearchResponse } from "../interfaces/place"

export function useAddressSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedTerm] = useDebounce(searchTerm, 300)
  const [addressOptions, setAddressOptions] = useState<IPlace[]>([])

  useEffect(() => {
    if (debouncedTerm.length < 3) return

    async function fetchAddressPredictions() {
      const response = await fetch("https://places.googleapis.com/v1/places:searchText", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": "AIzaSyATFFlBVvbstEAytcAChHNX73TIrsFmGzU",
          "X-Goog-FieldMask": "places.id,places.formattedAddress,places.location,places.addressComponents,places.displayName"
        },
        body: JSON.stringify({ textQuery: debouncedTerm }),
      })

      const data: IPlaceSearchResponse = await response.json()
      setAddressOptions(data.places || [])
    }

    fetchAddressPredictions()
  }, [debouncedTerm])

  return { addressOptions, searchTerm, setSearchTerm }
}