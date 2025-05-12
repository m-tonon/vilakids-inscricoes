import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PagBankResponse, PaymentData } from '../../../shared/types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private apiUrl = `${environment.apiBaseUrl}/payments`;

  constructor(private http: HttpClient) {}

  createCheckoutPage(paymentRequest: PaymentData): Observable<PagBankResponse> {
    const url = `${this.apiUrl}/checkout_page`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<PagBankResponse>(url, paymentRequest, { headers, withCredentials: true });
  }

  handleNotifications(notificationData: any): Observable<any> {
    const url = `${this.apiUrl}/notifications`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post(url, notificationData, { headers, withCredentials: true });
  }
}