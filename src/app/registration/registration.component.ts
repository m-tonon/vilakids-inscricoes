import { Component, PLATFORM_ID, inject, ViewChild } from '@angular/core';
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
})
export class RegistrationComponent {
  @ViewChild('stepper') stepper: any;
  @ViewChild('pagSeguroModal') pagSeguroModal: any;

  private readonly platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);
  private dialogService = inject(NbDialogService);

  registrationForm: FormGroup;
  acknowledgmentForm: FormGroup;
  paymentForm: FormGroup;

  paymentConfirmed = false;
  private dialogRef: NbDialogRef<any> | null = null; // Store dialog reference

  // PagSeguro payment URL
  private readonly pagSeguroUrl = 'https://pag.ae/7_B7ktZ7G';

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
    if (isPlatformBrowser(this.platformId)) {
      // Open PagSeguro in a new window
      window.open(this.pagSeguroUrl, '_blank');

      // Open confirmation modal and store the dialog reference
      this.dialogRef = this.dialogService.open(this.pagSeguroModal, {
        hasBackdrop: true,
        closeOnBackdropClick: false,
      });

      // Handle dialog close
      this.dialogRef.onClose.subscribe((success: boolean) => {
        if (success) {
          this.paymentForm.patchValue({ paymentConfirmed: true });
          this.stepper.next(); // Move to confirmation step
        }
        this.dialogRef = null; // Clear reference
      });
    }
  }

  confirmPayment(success: boolean) {
    this.paymentConfirmed = success;
    if (this.dialogRef) {
      this.dialogRef.close(success); // Close dialog with success status
    }
  }

  dismiss() {
    if (this.dialogRef) {
      this.dialogRef.close(false); // Close dialog without confirming payment
    }
  }

  calculateInstallments(totalValue: number, installments: number): number {
    return totalValue / installments;
  }
}