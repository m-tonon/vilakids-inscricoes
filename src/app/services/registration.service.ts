import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ExportedRegistration, RegistrationFormData, SaveRegistrationResponse } from '../../../shared/registration.interface';
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

  retrieveRegistrations(): Observable<ExportedRegistration[]> {
    const url = `${this.apiUrl}/export?json=1`;
    return this.http.get<ExportedRegistration[]>(url, { withCredentials: true });
  }

  exportRegistrations(): Observable<Blob> {
    const url = `${this.apiUrl}/export?json=0`;
    return this.http.get(url, { responseType: 'blob', withCredentials: true });
  }
}