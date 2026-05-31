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
  NbTooltipModule,
} from '@nebular/theme';
import { RegistrationService } from '../services/registration.service';
import { PaymentService } from '../services/payment.service';
import {
  GenderCount,
  PaymentData,
  RegistrationFormData,
  SaveRegistrationResponse,
} from '../../../shared/registration.interface';
import {
  AppApiError,
  PagBankResponse,
} from '../../../shared/payment.interface';
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
    NbDateFnsDateModule,
    NbTooltipModule,
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

  registrationsEnded = signal(false);
  installmentAvailable = signal(true);
  isRegistrationComplete = signal(false);
  isPaymentConfirmed = signal(false);
  isLoading = signal(false);
  calculatedAge = signal<number | null>(null);
  genderCounts = signal<GenderCount>({ masculino: 0, feminino: 0 });
  selectedGenderLimitReached = signal(false);

  checkoutUrl: string = '';
  referenceId: string = this.generateReferenceId();

  campInfo = {
    name: '6º Acampa Kids',
    dates: '30 de outubro a 01 de novembro de 2026',
    location: 'Acampamento Evangélico Maanaim',
    price: 280.0,
    minAge: 6,
    maxAge: 11,
    preletor: {
      name: 'Projeto Cantando o Catecismo',
      description:
        'Criado pelo casal Eliel e Drielle Espíndola, o Projeto Cantando o Catecismo tem transformado o aprendizado do Breve Catecismo de Westminster em uma experiência musical e envolvente.<br/><br/>Desde 2020, o projeto tem musicado as 107 perguntas do catecismo, ajudando famílias e igrejas a ensinar doutrina sólida de forma memorável — especialmente para as crianças. Com Eliel (bacharel em Música e educador musical) e Drielle à frente, o trabalho já alcança diversas partes do Brasil e do mundo, com canções sendo traduzidas para missões internacionais.<br/><br/>Durante o acampamento, você terá a oportunidade de aprender e cantar as verdades da fé reformada de maneira única, divertida e edificante.<br/><br/>📱 <b>Instagram:</b> <a href="https://www.instagram.com/cantando.catecismo" target="_blank">@cantando.catecismo</a><br/>🎥 <b>YouTube:</b> <a href="https://www.youtube.com/@cantandoocatecismo" target="_blank">Cantando o Catecismo</a>',
    },
    contacts: [
      { name: 'Secretaria IPVO', phone: '(44) 3226-4473' },
      { name: 'Anjinho', phone: '(44) 9 9846-0089' },
    ],
    description: `Está chegando o <strong>6º ACAMPAKIDS</strong> da IPVO, uma ótima oportunidade para que seu filho(a) possa fortalecer a fé e desenvolver autonomia e comunhão.<br/><br/>
        Garanta a sua vaga e lembre-se de convidar algum amigo!<br/><br/>
        ⚠️ <b>Importante:</b> Sua vaga só está garantida mediante pagamento.
      `,
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

    this.loadGenderCounts();

    this.acknowledgmentForm = this.fb.group({
      hasReadInfo: [false, Validators.requiredTrue],
      termsAccepted: [false, Validators.requiredTrue],
    });

    this.registrationForm = this.fb.group({
      childName: ['', Validators.required],
      birthDate: ['', Validators.required],
      age: [
        '',
        [
          Validators.required,
          Validators.min(this.campInfo.minAge),
          Validators.max(12),
        ],
      ],
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
    });

    this.registrationForm.get('birthDate')?.valueChanges.subscribe((value) => {
      if (value) {
        const date = new Date(value);
        if (!isNaN(date.getTime())) {
          const age = this.calculateAge(date);
          this.calculatedAge.set(age);
          this.registrationForm.get('age')?.setValue(age, { emitEvent: false });
        } else {
          this.calculatedAge.set(null);
        }
      } else {
        this.calculatedAge.set(null);
      }
    });

    this.registrationForm
      .get('gender')
      ?.valueChanges.subscribe((selectedGender) => {
        this.checkGenderLimit(selectedGender);
        if (this.selectedGenderLimitReached()) {
          this.toastrService.warning(
            'Infelizmente as inscrições para este grupo já se esgotaram.',
            'Inscrições encerradas',
            {
              duration: 10000,
              hasIcon: true,
              icon: 'alert-circle',
              status: 'warning',
            },
          );
          this.registrationForm.get('gender')?.setValue('');
          this.selectedGenderLimitReached.set(true);
        }
      });
  }

  canProceedToRegistration(): boolean {
    return this.acknowledgmentForm.valid;
  }

  canProceedToPayment(): boolean {
    return this.registrationForm.valid && !this.selectedGenderLimitReached();
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
        formData.birthDate = new Intl.DateTimeFormat('en-GB').format(date);
      }

      const paymentData: PaymentData = {
        referenceId: this.referenceId,
        paymentConfirmed: false,
        name: formData.responsibleInfo.name,
        cpf: formData.responsibleInfo.document.replace(/\D/g, ''),
        phone: formData.responsibleInfo.phone,
        email: formData.responsibleInfo.email,
      };

      formData.payment = paymentData;

      this.paymentService
        .createCheckoutPage(paymentData)
        .pipe(
          switchMap((response: PagBankResponse) => {
            const payLink = response.links.find((r) => r.rel === 'PAY');
            if (payLink && payLink.href) {
              this.checkoutUrl = payLink.href;
              formData.payment.checkoutUrl = payLink.href;
              return this.registrationService.saveRegistration(formData);
            } else {
              throw new Error('PAY link not found in response.');
            }
          }),
        )
        .subscribe({
          next: (response: SaveRegistrationResponse) => {
            this.toastrService.success(
              'Dados salvos com sucesso. Você será redirecionado para a página de pagamento.',
              'Sucesso',
              {
                duration: 5000,
                hasIcon: true,
                icon: 'checkmark-circle',
                status: 'success',
              },
            );

            this.isRegistrationComplete.set(true);
            this.isLoading.set(false);
          },
          error: (error) => {
            console.error('Error saving registration and payment data:', error);

            const apiError = error?.error?.error as AppApiError;
            const source = apiError?.source;

            let errorMsg =
              'Ocorreu um erro inesperado. Entre em contato com a secretaria';
            if (source === 'PagBank') {
              errorMsg =
                'Erro ao processar o pagamento. Alguns dados do responsável podem estar incorretos.';
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
        },
      );
    }
  }

  getFieldStatus(fieldName: string): string {
    const field =
      this.registrationForm.get(fieldName) ||
      this.acknowledgmentForm.get(fieldName);

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

  generateReferenceId() {
    const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase();
    return `REF-${randomPart}`;
  }

  goToNextStep() {
    this.stepper()?.next();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  private calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  private loadGenderCounts(): void {
    this.registrationService.getGenderCount().subscribe({
      next: (counts) => {
        this.genderCounts.set(counts);
      },
      error: (error) => {
        console.error('Error loading gender counts:', error);
        this.genderCounts.set({ masculino: 0, feminino: 0 });
      },
    });
  }

  private checkGenderLimit(selectedGender: string): void {
    if (!selectedGender) {
      this.selectedGenderLimitReached.set(false);
      return;
    }

    const counts = this.genderCounts();
    const maxPerGender = 50;

    if (selectedGender === 'Masculino' && counts.masculino >= maxPerGender) {
      this.selectedGenderLimitReached.set(true);
    } else if (
      selectedGender === 'Feminino' &&
      counts.feminino >= maxPerGender
    ) {
      this.selectedGenderLimitReached.set(true);
    } else {
      this.selectedGenderLimitReached.set(false);
    }
  }
}
