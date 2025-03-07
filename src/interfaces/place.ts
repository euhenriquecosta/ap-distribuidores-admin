export interface IAddressComponent {
  longText?: string;
  shortText?: string;
  types: string[];
  languageCode: string;
}

export interface ILocation {
  latitude: number;
  longitude: number;
}

export interface DisplayName {
  text: string;
  languageCode: string;
}

export interface IPlace {
  id: string;
  formattedAddress: string;
  addressComponents: IAddressComponent[];
  location: ILocation;
  displayName: DisplayName;
}

export interface IPlaceSearchResponse {
  places: IPlace[];
}