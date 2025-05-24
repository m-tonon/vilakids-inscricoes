export interface PagBankResponse {
  id: string;
  reference_id: string;
  expiration_date: string;
  created_at: string;
  status: string;
  customer: PagBankCustomer;
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
  links: PagLinks[];
}

export interface PagLinks {
  rel: string;
  href: string;
  method: string;
}

export interface PagBankNotification {
  id: string;
  reference_id: string;
  created_at: string;
  customer: PagBankCustomer;
  charges: PagBankCharge[];
}

export interface PagBankCustomer {
  name: string;
  tax_id: string;
  phone: {
    country: string;
    area: string;
    number: string;
  };
}

export interface PagBankCharge {
  id: string;
  reference_id: string;
  status: string;
  created_at: string;
  paid_at: string;
  amount: number;
}

export interface AppApiError {
  source?: 'PagBank' | 'App' | 'Network';
  code?: string;
  message: string;
}
