

  
  export interface LoginResponseType {
    status: boolean;
    message: string;
    data: UserData;
  }
  


export interface UserData {
  id: string;
  company_id: string;
  branch_id: string;
  agency_id: string;
  email: string;
  status: string;
  role: string;
  phone: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  staff_id: string | null;
  first_name: string | null;
  last_name: string | null;
  token: string;
  permissions: string[];
  company: Company;
  branch: Branch;
}

export interface Company {
  id: string;
  email: string;
  name: string;
  company_phone: string;
  website: string | null;
  company_type: string;
  owner_id: string;
  logo: string | null;
  created_at: string;
  updated_at: string;
  logo_url: string;
}

export interface Branch {
  id: string;
  company_id: string;
  name: string;
  status: number;
  created_at: string;
  updated_at: string;
  address: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  agency_id: string;
  manager_id: string | null;
}
