import axios from "axios";

// interface ResponseData {
//   places: {
//     displayName: { text: string, languageCode: string }[];
//     formattedAddress: string;
//     id: string;
//   };
// }

const goog = axios.create({
  baseURL: "https://places.googleapis.com/v1/places",
  headers: {
    "Content-Type": "application/json",
    "X-Goog-FieldMask": "places.displayName,places.formattedAddress,places.id",
    "X-Goog-Api-Key": "AIzaSyATFFlBVvbstEAytcAChHNX73TIrsFmGzU",
  }
})

export async function fetchPlace(text: string) {
  const response = await goog.post(":searchText", {
    textQuery: text,
  });
  return response.data;
}

// https://places.googleapis.com/v1/places:searchText

// {
//   "textQuery" : "Spicy Vegetarian Food in Sydney, Australia"
// }

// Content-Type: application/json
// X-Goog-FieldMask places.displayName,places.formattedAddress,places.id
// X-Goog-Api-Key AIzaSyATFFlBVvbstEAytcAChHNX73TIrsFmGzU