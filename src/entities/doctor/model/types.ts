export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photo: string;
  rating: number;
  reviewCount: number;
  experience: string;
  education: string[];
  languages: string[];
  clinicId: string;
  schedule: {
    days: string[];
    hours: string;
  };
  price: string;
  acceptsInsurance: string[];
  about: string;
}
