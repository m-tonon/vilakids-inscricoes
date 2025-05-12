import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegistrationFormData, SaveRegistrationResponse } from '../../../shared/types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistrationService {
  private apiUrl = `${environment.apiBaseUrl}/registrations`;


  constructor(private http: HttpClient) {}

  saveRegistration(registrationForm: RegistrationFormData): Observable<SaveRegistrationResponse> {
    const url = `${this.apiUrl}/save-registration`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, registrationForm, { headers, withCredentials: true });
  }
}