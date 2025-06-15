import axios from "axios";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

// Geocoding → Endereço para Lat/Lng
export const getLatLngFromAddressService = async (
  address: string
): Promise<{ lat: number; lng: number }> => {
  const response = await axios.get(
    "https://maps.googleapis.com/maps/api/geocode/json",
    {
      params: {
        address,
        key: GOOGLE_MAPS_API_KEY,
      },
    }
  );

  if (response.data.status !== "OK") {
    throw new Error("Endereço não encontrado");
  }

  const location = response.data.results[0].geometry.location;
  return { lat: location.lat, lng: location.lng };
};
