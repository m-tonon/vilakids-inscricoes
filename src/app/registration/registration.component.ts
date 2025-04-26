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
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
})
export class RegistrationComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);

  registrationForm: FormGroup;

  campInfo = {
    name: '5º Acampa Kids',
    dates: '03, 04 e 05 de outubro de 2025',
    location: 'Acampamento Evangélico Maanaim',
    price: 210.00,
    minAge: 6,
    maxAge: 11,
    preletor: {
      name: 'Marcus Nati',
      description: 'Teólogo, pregador, presbítero, desenhista, designer e criador do perfil @brother_bíblia'
    },
    contacts: [
      { name: 'Secretaria IPVO', phone: '(44) 3226-4473' },
      { name: 'Anjinho', phone: '(44) 9 9846-0089' }
    ],
    description: 'Está chegando o 5º ACAMPAKIDS da IPVO, uma ótima oportunidade para que seu filho(a) possa fortalecer a fé e desenvolver autonomia e comunhão.',
    paymentOptions: {
      methods: ['PIX', 'Cartão de Crédito'],
      maxInstallments: 7
    }
  };

  constructor() {
    this.registrationForm = this.fb.group({
      childName: ['', Validators.required],
      birthDate: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(6), Validators.max(11)]],
      responsibleName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      medications: [''],
      allergies: [''],
      specialNeeds: [''],
      emergencyContact: this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required],
        relation: ['', Validators.required],
      }),
      paymentMethod: ['', Validators.required],
      installments: [1],
    });
  }

  onSubmit() {
    if (isPlatformBrowser(this.platformId) && this.registrationForm.valid) {
      console.log('Form submitted:', this.registrationForm.value);
    }
  }

  calculateInstallments(totalValue: number, installments: number): number {
    return totalValue / installments;
  }
}
