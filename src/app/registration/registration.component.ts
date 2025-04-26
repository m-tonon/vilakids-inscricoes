import { Component, PLATFORM_ID, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, FormsModule, ClarityModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class RegistrationComponent {
  private readonly platformId = inject(PLATFORM_ID);

  registrationData = {
    firstName: '',
    lastName: '',
    email: '',
    birthDate: '',
    phoneNumber: '',
    campSession: '',
    specialNeeds: '',
    emergencyContact: {
      name: '',
      phone: '',
      relation: ''
    }
  };

  campSessions = [
    { id: 1, name: 'Summer Session 1 (June 1-15)' },
    { id: 2, name: 'Summer Session 2 (June 16-30)' },
    { id: 3, name: 'Summer Session 3 (July 1-15)' },
    { id: 4, name: 'Summer Session 4 (July 16-31)' }
  ];

  onSubmit() {
    if (isPlatformBrowser(this.platformId)) {
      console.log('Form submitted:', this.registrationData);
    }
    // Add your form submission logic here
  }
}
