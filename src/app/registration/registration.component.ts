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
  NbToastrService,
} from '@nebular/theme';
import { RegistrationService } from '../services/registration.service';
import { PaymentService } from '../services/payment.service';
import {
  AppApiError,
  PagBankResponse,
  PaymentData,
  RegistrationFormData,
  SaveRegistrationResponse,
} from '../../../shared/types';
import { ActivatedRoute } from '@angular/router';
import { NgxMaskDirective } from 'ngx-mask';
import { switchMap } from 'rxjs';
import { NbDateFnsDateModule } from '@nebular/date-fns';

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
    NbDateFnsDateModule
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
  private toastrService = inject(NbToastrService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);

  registrationForm!: FormGroup;
  acknowledgmentForm!: FormGroup;

  isRegistrationComplete = signal(false);
  isPaymentConfirmed = signal(false);
  isLoading = signal(false);
  checkoutUrl: string = '';

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
      methods: ['PIX', 'Cartão de Crédito', 'Cartão de Débito'],
      maxInstallments: 10,
    },
  };

  constructor() {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      const paymentConfirmed = params.get('paymentCompleted');
      if (paymentConfirmed) {
        this.isPaymentConfirmed.set(true);
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
        document: ['', [Validators.required, Validators.minLength(11)]],
        phone: ['', [Validators.required, Validators.minLength(11)]],
        email: ['', [Validators.required, Validators.email]],
        relation: [''],
      }),
      parentalAuthorization: [false, Validators.requiredTrue],
      payment: this.fb.group({
        referenceId: [''],
        paymentConfirmed: [false],
      }),
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

      const birthDate = formData.birthDate;
      if (birthDate) {
        const date = new Date(birthDate);
        formData.birthDate = date.toISOString().split('T')[0];
      }

      const paymentData: PaymentData = {
        referenceId: '',
        paymentConfirmed: false,
        name: formData.responsibleInfo.name,
        cpf: formData.responsibleInfo.document.replace(/\D/g, ''),
        phone: formData.responsibleInfo.phone,
        email: formData.responsibleInfo.email,
      };

      this.paymentService
        .createCheckoutPage(paymentData)
        .pipe(
          switchMap((response: PagBankResponse) => {
            const payLink = response.links.find((r) => r.rel === 'PAY');
            if (payLink && payLink.href) {
              this.checkoutUrl = payLink.href;
              formData.payment.referenceId = response.reference_id;
              return this.registrationService.saveRegistration(formData);
            } else {
              throw new Error('PAY link not found in response.');
            }
          })
        )
        .subscribe({
          next: (response: SaveRegistrationResponse) => {
            console.log(
              'Registration and payment data saved successfully:',
              response
            );
            this.isRegistrationComplete.set(true);
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error saving registration and payment data:', error);

            const apiError = error?.error?.error as AppApiError;
            const source = apiError?.source;

            let errorMsg = 'Ocorreu um erro inesperado. Entre em contato com a secretaria';
            if (source === 'PagBank') {
              errorMsg = 'Erro ao processar o pagamento. Alguns dados do responsável podem estar incorretos.';
            }

            this.toastrService.danger(errorMsg, 'Erro', {
              duration: 10000,
              hasIcon: true,
              icon: 'close-circle',
              status: 'danger',
            });

            this.isLoading.set(false);
          },
        });
    }
  }

  openPaymentPage(): void {
    if (this.checkoutUrl) {
      this.isLoading.set(true);
      window.location.href = this.checkoutUrl;
    } else {
      this.toastrService.danger(
        'Erro ao abrir a página de pagamento.',
        'Erro',
        {
          duration: 5000,
          hasIcon: true,
          icon: 'close-circle',
          status: 'danger',
        }
      );
    }
  }

  getFieldStatus(fieldName: string): string {
    const field =
      this.registrationForm.get(fieldName) || this.acknowledgmentForm.get(fieldName);

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
      if (field.errors?.['email']) {
        return 'warning';
      }
      if (field.errors?.['minlength'] || field.errors?.['maxlength']) {
        return 'warning';
      }
    }

    return 'basic';
  }

  goToNextStep() {
    this.stepper()?.next();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
