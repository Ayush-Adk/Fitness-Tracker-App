export interface Activity {
  id: string;
  user_id: string;
  type: string;
  description?: string;
  duration: number;
  calories?: number;
  distance?: number;
  date: string;
  created_at?: string;
  is_template?: boolean;
  template_name?: string;
  template_description?: string;
  is_public?: boolean;
}

export interface Goal {
  id: string;
  user_id: string;
  type: string;
  target: number;
  current: number;
  unit: string;
  deadline?: string;
  created_at?: string;
  updated_at?: string;
}