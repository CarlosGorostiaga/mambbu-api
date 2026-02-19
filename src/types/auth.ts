export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreatePropertyRequest {
  title: string;
  description: string;
  price: string;
  priceValue: number;
  location: string;
  locationDistrict: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  yearBuilt?: number;
  amenities: string[];
  agentId: string;
}