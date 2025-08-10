export interface User {
  id: number;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string;
  is_admin: number;
  email_verified_at: Date | null;
  last_login: Date | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  token: string;
  company_id: string;
  branch_id: string;
  status: string;
  role: string;
  remember_token: null;
  permission: Array<string>;
  Branch: Branch[];
}

export interface UserProfileDetails  {
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
  branch: Branch;
  account_manager_id: string;
  name: string;
  client_type: string | null;
  external_code: string | null;
  contact_email: string;
  reg_date: string | null;
  contact_phone: string;
  approved_by: string | null;
  address: string | null;
};

export type Branch = {
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
};