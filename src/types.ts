export interface FurnitureItem {
  id: string;
  title: string;
  category: string;
  image: string;
  description: string;
  materials: string[];
  dimensions: string;
  priceEstimate: string;
  specs: {
    hardware?: string;
    facade?: string;
    countertop?: string;
    leadTime?: string;
  };
}

export interface InquiryFormData {
  name: string;
  phone: string;
  category: string;
  comments: string;
}

export interface ShowroomBookingData {
  name: string;
  phone: string;
  date: string;
  time: string;
  consultant: string;
  notes?: string;
}

export interface MaterialSample {
  id: string;
  name: string;
  category: string;
  image: string;
  origin: string;
  finishType: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  type: "product" | "material";
  sort_order: number;
}

export interface PortfolioProject {
  id: string;
  title: string;
  location: string;
  area: string;
  duration: string;
  materialsUsed: string[];
  imageBefore: string;
  imageAfter: string;
  description: string;
}
