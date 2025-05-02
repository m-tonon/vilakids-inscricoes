import { Component, PLATFORM_ID, inject, viewChild, ChangeDetectionStrategy, OnInit } from '@angular/core';
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
  NbDialogService,
  NbDialogModule,
  NbDialogRef,
  NbStepperComponent,
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
    NbDialogModule,
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent implements OnInit {
  stepper = viewChild<NbStepperComponent>('stepper');

  private readonly platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);

  registrationForm!: FormGroup;
  acknowledgmentForm!: FormGroup;
  paymentForm!: FormGroup;

  paymentConfirmed = false;
  private dialogRef?: NbDialogRef<any> | null = null;

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
      methods: ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto'],
      maxInstallments: 10,
    },
  };

  constructor() {}

  ngOnInit(): void {
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
        phone: ['', Validators.required],
        relation: [''],
        document: ['', Validators.required],
      }),
      parentalAuthorization: [false, Validators.requiredTrue],
    });

    this.paymentForm = this.fb.group({
      paymentMethod: ['PagSeguro', Validators.required],
      paymentConfirmed: [false, Validators.requiredTrue],
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
    }
  }

  openPayment() {
    // if (isPlatformBrowser(this.platformId)) {
    //   window.open(this.pagSeguroUrl, '_blank');

    //   this.dialogRef = this.dialogService.open(this.pagSeguroModal()!, {
    //     hasBackdrop: true,
    //     closeOnBackdropClick: false,
    //   });

    //   this.dialogRef.onClose.subscribe((success: boolean) => {
    //     if (success) {
    //       this.paymentForm.patchValue({ paymentConfirmed: true });
    //       this.stepper()?.next();
    //     }
    //     this.dialogRef = null;
    //   });
    // }
  }

  confirmPayment(success: boolean) {
    this.paymentConfirmed = success;
    if (this.dialogRef) {
      this.dialogRef.close(success);
    }
  }

  dismiss() {
    if (this.dialogRef) {
      this.dialogRef.close(false);
    }
  }

  calculateInstallments(totalValue: number, installments: number): number {
    return totalValue / installments;
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