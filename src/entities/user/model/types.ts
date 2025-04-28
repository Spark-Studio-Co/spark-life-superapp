export interface User {
  id: number;
  email: string;
  phone: string;
  first_name: string;
  last_name: string;
  patronymic?: string;
  diseases: string[];
  med_doc: string;
  role: string;
  weekly_water: Record<string, any>;
  weekly_sleep: Record<string, any>;
  gender: "Male" | "Female" | "Undefined";
  age: number | null;
  height: number | null;
  weight: number | null;
}
