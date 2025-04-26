import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import {
  ReactiveFormsModule,
  FormGroup,
  FormBuilder,
  Validators,
} from '@angular/forms';
import {
  NbCardModule,
  NbInputModule,
  NbSelectModule,
  NbButtonModule,
  NbFormFieldModule,
  NbDatepickerModule,
  NbIconModule,
  NbStepperModule,
  NbCheckboxModule,
} from '@nebular/theme';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
    NbSelectModule,
    NbButtonModule,
    NbFormFieldModule,
    NbDatepickerModule,
    NbIconModule,
    NbStepperModule,
    NbCheckboxModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);

  registrationForm: FormGroup;
  acknowledgmentForm: FormGroup;
  paymentForm: FormGroup;

  campInfo = {
    name: '5º Acampa Kids',
    dates: '03, 04 e 05 de outubro de 2025',
    location: 'Acampamento Evangélico Maanaim',
    price: 210.0,
    minAge: 6,
    maxAge: 11,
    preletor: {
      name: 'Marcus Nati',
      description:
        'Teólogo, pregador, presbítero, desenhista, designer e criador do perfil <a href="https://www.instagram.com/brother_biblia" target="_blank">@brother_biblia</a>',
    },
    contacts: [
      { name: 'Secretaria IPVO', phone: '(44) 3226-4473' },
      { name: 'Anjinho', phone: '(44) 9 9846-0089' },
    ],
    description:
      'Está chegando o 5º ACAMPAKIDS da IPVO, uma ótima oportunidade para que seu filho(a) possa fortalecer a fé e desenvolver autonomia e comunhão.',
    paymentOptions: {
      methods: ['PIX', 'Cartão de Crédito'],
      maxInstallments: 7,
    },
  };

  constructor() {
    this.acknowledgmentForm = this.fb.group({
      hasReadInfo: [false, Validators.requiredTrue],
      termsAccepted: [false, Validators.requiredTrue],
    });

    this.registrationForm = this.fb.group({
      childName: ['', Validators.required],
      birthDate: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(6), Validators.max(11)]],
      gender: ['', Validators.required],
      identityDocument: ['', Validators.required],
      address: ['', Validators.required],
      churchMembership: [''],
      churchName: [''],
      healthInsurance: [''],
      medications: [''],
      allergies: [''],
      specialNeeds: [''],
      responsibleName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      emergencyContact: this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required],
        relation: ['', Validators.required],
      }),
      parentalAuthorization: [false, Validators.requiredTrue],
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['', Validators.required],
      installments: [1],
    });
  }

  canProceedToRegistration(): boolean {
    return this.acknowledgmentForm.valid;
  }

  canProceedToPayment(): boolean {
    return this.registrationForm.valid;
  }

  onSubmit() {
    if (
      isPlatformBrowser(this.platformId) &&
      this.acknowledgmentForm.valid &&
      this.registrationForm.valid &&
      this.paymentForm.valid
    ) {
      const formData = {
        ...this.registrationForm.value,
        payment: this.paymentForm.value,
        acknowledgment: this.acknowledgmentForm.value,
      };
      console.log('Form submitted:', formData);
      // TODO: Implement payment integration
    }
  }

  calculateInstallments(totalValue: number, installments: number): number {
    return totalValue / installments;
  }
}
