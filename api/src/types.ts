export interface PaymentData {
  checkoutId?: string;
  paymentConfirmed: boolean;
  name: string;
  cpf: string;
  email?: string;
  phone?: string;
}

export interface RegistrationFormData {
  childName: string;
  birthDate: string;
  age: number;
  gender: string;
  identityDocument: string;
  address: string;
  churchMembership: string;
  churchName: string;
  healthInsurance: string;
  medications: string;
  allergies: string;
  specialNeeds: string;
  responsibleInfo: {
    name: string;
    phone: string;
    relation: string;
    document: string;
  };
  parentalAuthorization: boolean;
  payment: PaymentData;
}

export interface PagBankResponse {
  id: string;
  reference_id: string;
  expiration_date: string;
  created_at: string;
  status: string;
  customer: {
    name: string;
    tax_id: string;
  };
  customer_modifiable: boolean;
  items: Array<{
    name: string;
    quantity: number;
    unit_amount: number;
  }>;
  additional_amount: number;
  discount_amount: number;
  payment_methods: Array<{ type: string }>;
  payment_methods_configs: Array<{
    type: string;
    config_options: Array<{ option: string; value: string }>;
  }>;
  soft_descriptor: string;
  redirect_url: string;
  return_url: string;
  notification_urls: string[];
  payment_notification_urls: string[];
  links: Array<{
    rel: string;
    href: string;
    method: string;
  }>;
}