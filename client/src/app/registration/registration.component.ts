import {
  Component,
  PLATFORM_ID,
  inject,
  viewChild,
  ChangeDetectionStrategy,
  OnInit,
  signal,
} from '@angular/core';
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
  NbDialogModule,
  NbStepperComponent,
  NbSpinnerModule,
} from '@nebular/theme';
import { RegistrationService } from '../services/registration.service';
import { PaymentService } from '../services/payment.service';
import {
  PagBankResponse,
  PaymentData,
  RegistrationFormData,
  SaveRegistrationResponse,
} from '../types';
import { ActivatedRoute } from '@angular/router';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

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
    NbDialogModule,
    NbSpinnerModule,
    NgxMaskDirective,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent implements OnInit {
  stepper = viewChild<NbStepperComponent>('stepper');
  private readonly platformId = inject(PLATFORM_ID);
  private registrationService = inject(RegistrationService);
  private paymentService = inject(PaymentService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  registrationForm!: FormGroup;
  acknowledgmentForm!: FormGroup;
  paymentForm!: FormGroup;

  submissionMessage: string | null = null;
  isPaymentConfirmed = signal(false);
  isLoading = signal(false);

  campInfo = {
    name: '5º Acampa Kids',
    dates: '03, 04 e 05 de outubro de 2025',
    location: 'Acampamento Evangélico Maanaim',
    price: 230.0,
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
      methods: ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto'],
      maxInstallments: 10,
    },
  };

  constructor() {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const paymentConfirmed = params.get('paymentCompleted');
      if (paymentConfirmed) {
        this.isPaymentConfirmed.set(true);
        this.submissionMessage = 'Payment confirmed successfully!';
      }
    });

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
      address: [''],
      churchMembership: [''],
      churchName: [''],
      healthInsurance: [''],
      medications: [''],
      allergies: [''],
      specialNeeds: [''],
      responsibleInfo: this.fb.group({
        name: ['', Validators.required],
        document: ['', Validators.required],
        phone: ['', Validators.required],
        email: ['', Validators.required],
        relation: [''],
      }),
      parentalAuthorization: [false, Validators.requiredTrue],
    });
  }

  canProceedToRegistration(): boolean {
    return this.acknowledgmentForm.valid;
  }

  canProceedToPayment(): boolean {
    return this.registrationForm.valid;
  }

  onSubmit(): void {
    if (
      isPlatformBrowser(this.platformId) &&
      this.acknowledgmentForm.valid &&
      this.registrationForm.valid
    ) {
      this.isLoading.set(true);

      const formData: RegistrationFormData = this.registrationForm.value;

      this.registrationService.saveRegistration(formData).subscribe({
        next: (response: SaveRegistrationResponse) => {
          this.submissionMessage =
            response.message || 'Registration successful!';
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error during registration:', error);
          this.submissionMessage =
            'Failed to submit registration. Please try again.';
          this.isLoading.set(false);
        },
      });
    } else {
      this.submissionMessage = 'Please fill out all required fields.';
    }
  }

  openPayment(): void {
    this.isLoading.set(true);

    const paymentData: PaymentData = {
      checkoutId: '',
      paymentConfirmed: false,
      name: this.registrationForm.get('responsibleInfo.name')?.value,
      cpf: this.registrationForm.get('responsibleInfo.document')?.value,
      phone: this.registrationForm.get('responsibleInfo.phone')?.value,
      email: this.registrationForm.get('responsibleInfo.email')?.value,
    }

    this.paymentService.createCheckoutPage(paymentData).subscribe({
      next: (response: PagBankResponse) => {
        const payLink = response.links.find((r) => r.rel === 'PAY');
        if (payLink && payLink.href) {
          const checkoutUrl = payLink.href;
          window.location.href = checkoutUrl;
        } else {
          console.error('PAY link not found in response.');
          this.submissionMessage =
            'Failed to initiate payment. Please try again.';
        }
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error initiating payment:', error);
        this.submissionMessage =
          'Failed to initiate payment. Please try again.';
        this.isLoading.set(false);
      },
    });
  }

  getFieldStatus(fieldName: string): string {
    const field =
      this.registrationForm.get(fieldName) ||
      this.acknowledgmentForm.get(fieldName) ||
      this.paymentForm.get(fieldName);

    if (!field) {
      console.warn(`Field '${fieldName}' not found in any form.`);
      return 'basic';
    }

    if (field.invalid && field.touched) {
      if (field.errors?.['required']) {
        return 'danger';
      }
      if (field.errors?.['min']) {
        return 'danger';
      }
      if (field.errors?.['max']) {
        return 'danger';
      }
    }

    return 'basic';
  }

  goToNextStep() {
    this.stepper()?.next();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
