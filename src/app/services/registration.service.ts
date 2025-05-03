import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrationFormData, SaveRegistrationResponse } from '../types';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = 'https://vilakids-backend.vercel.app/registrations';

  constructor(private http: HttpClient) {}

  saveRegistration(registrationForm: RegistrationFormData): Observable<SaveRegistrationResponse> {
    const url = `${this.apiUrl}/save-registration`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(this.apiUrl, registrationForm, { headers });
  }
}