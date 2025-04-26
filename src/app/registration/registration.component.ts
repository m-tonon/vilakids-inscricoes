import { Component, PLATFORM_ID, inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { 
  NbCardModule, 
  NbInputModule, 
  NbSelectModule, 
  NbButtonModule,
  NbFormFieldModule,
  NbDatepickerModule
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
    NbDatepickerModule
  ],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss'
})
export class RegistrationComponent {
  private readonly platformId = inject(PLATFORM_ID);
  private fb = inject(FormBuilder);

  registrationForm: FormGroup;

  campSessions = [
    { id: 1, name: 'Summer Session 1 (June 1-15)' },
    { id: 2, name: 'Summer Session 2 (June 16-30)' },
    { id: 3, name: 'Summer Session 3 (July 1-15)' },
    { id: 4, name: 'Summer Session 4 (July 16-31)' }
  ];

  constructor() {
    this.registrationForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      birthDate: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      campSession: ['', Validators.required],
      specialNeeds: [''],
      emergencyContact: this.fb.group({
        name: ['', Validators.required],
        phone: ['', Validators.required],
        relation: ['', Validators.required]
      })
    });
  }

  onSubmit() {
    if (isPlatformBrowser(this.platformId) && this.registrationForm.valid) {
      console.log('Form submitted:', this.registrationForm.value);
    }
    // Add your form submission logic here
  }
}
