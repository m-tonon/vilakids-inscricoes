export interface PaymentData {
  referenceId: string;
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
    email: string;
  };
  parentalAuthorization: boolean;
  payment: PaymentData;
}

export interface SaveRegistrationResponse {
  message?: string;
  error?: string;
}

export interface ExportedRegistration {
  childName: string;
  birthDate: string;
  age: number;
  gender: string;
  identityDocument: string;
  address: string;
  churchMembership: boolean;
  churchName: string;
  healthInsurance: string;
  medications: string;
  allergies: string;
  specialNeeds: string;
  responsibleName: string;
  responsiblePhone: string;
  responsibleRelation: string;
  responsibleDocument: string;
  responsibleEmail: string;
  parentalAuthorization: boolean;
  paymentReferenceId?: string;
  paymentConfirmed?: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
}