import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TableModule } from 'primeng/table';
import { NbDateFnsDateModule } from '@nebular/date-fns';
import {
  NbButtonModule,
  NbCardModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { PhoneFormatPipe } from '../../../pipes/phone-format.pipe';
import { RegistrationService } from '../../../services/registration.service';
import { Observable } from 'rxjs';
import { ExportedRegistration } from '../../../../../shared/registration.interface';
import { IconFieldModule } from 'primeng/iconfield';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { StyleClassModule } from 'primeng/styleclass';

@Component({
  selector: 'app-registrations-overview',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbFormFieldModule,
    NbIconModule,
    NbSpinnerModule,
    NbDateFnsDateModule,
    MatProgressSpinnerModule,
    PhoneFormatPipe,
    TableModule,
    IconFieldModule,
    Button,
    Toast,
    ToastModule,
    StyleClassModule
  ],
  providers: [MessageService],
  templateUrl: './registrations-overview.component.html',
  styleUrl: './registrations-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationsOverviewComponent implements OnInit {
  private registrationService = inject(RegistrationService);
  private messageService = inject(MessageService);
  registrations$?: Observable<ExportedRegistration[]>;

  displayedColumns: string[] = [
    'Nome',
    'Idade',
    'Gênero',
    'Nome do responsável',
    'Telefone',
    'Pagamento confirmado',
    'Criado em',
  ];

  ngOnInit(): void {
    this.registrations$ = this.registrationService.retrieveRegistrations();
  }

  exportToCSV(): void {
    this.registrationService.exportRegistrations().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inscricoes2025.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to export CSV', err);
      },
    });
  }

  rowClass(reg: ExportedRegistration) {
    console.log(reg);
    return {
      'payment-true': reg.paymentConfirmed === true,
    };
  }

  updatePaymentStatus(reg: ExportedRegistration): void {
    this.messageService.add({ severity: 'info', summary: 'Product Selected', detail: reg.name });
  }
}
