import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-registrations-overview',
  standalone: true,
  imports: [
    FormsModule,
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
    StyleClassModule,
    SelectModule,
    TagModule,
    TooltipModule,
  ],
  providers: [MessageService],
  templateUrl: './registrations-overview.component.html',
  styleUrl: './registrations-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationsOverviewComponent implements OnInit {
  private registrationService = inject(RegistrationService);
  private messageService = inject(MessageService);
  private cdr = inject(ChangeDetectorRef);
  registrations$?: Observable<ExportedRegistration[]>;

  allRegistrations: ExportedRegistration[] = [];
  filteredRegistrations: ExportedRegistration[] = [];
  paymentFilter: 'all' | 'true' | 'false' = 'all';
  updatingReferenceIds = new Set<string>();
  genders: any[] = [
    { label: 'Masculino', value: 'Masculino' },
    { label: 'Feminino', value: 'Feminino' },
  ];

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.registrations$ = this.registrationService.retrieveRegistrations();
    this.registrations$.subscribe((regs) => {
      this.allRegistrations = regs;
      this.applyPaymentFilter();
      this.cdr.markForCheck();
    });
  }

  applyPaymentFilter(): void {
    if (this.paymentFilter === 'all') {
      this.filteredRegistrations = this.allRegistrations;
    } else if (this.paymentFilter === 'true') {
      this.filteredRegistrations = this.allRegistrations.filter(
        (r) => r.paymentConfirmed === true,
      );
    } else {
      this.filteredRegistrations = this.allRegistrations.filter(
        (r) => r.paymentConfirmed === false,
      );
    }
  }

  setPaymentFilter(filter: 'all' | 'true' | 'false') {
    this.paymentFilter = filter;
    this.applyPaymentFilter();
    this.cdr.markForCheck();
  }

  exportToCSV(): void {
    this.registrationService.exportRegistrations().subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'inscricoes2026.csv';
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Failed to export CSV', err);
      },
    });
  }

  togglePaymentStatus(reg: ExportedRegistration): void {
    const referenceId = reg.paymentReferenceId;
    if (!referenceId || this.updatingReferenceIds.has(referenceId)) {
      return;
    }

    const nextStatus = !reg.paymentConfirmed;
    this.updatingReferenceIds.add(referenceId);

    this.registrationService
      .updatePaymentStatus({
        paymentReferenceId: referenceId,
        paymentConfirmed: nextStatus,
      })
      .subscribe({
        next: () => {
          reg.paymentConfirmed = nextStatus;
          this.applyPaymentFilter();
          this.messageService.add({
            severity: 'success',
            summary: nextStatus ? 'Marcado como pago' : 'Marcado como pendente',
            detail: reg.childName,
          });
          this.updatingReferenceIds.delete(referenceId);
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error('Failed to update payment status', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro ao atualizar pagamento',
            detail: reg.childName,
          });
          this.updatingReferenceIds.delete(referenceId);
          this.cdr.markForCheck();
        },
      });
  }

  copyPaymentUrl(reg: ExportedRegistration): void {
    if (!reg.checkoutUrl) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Link indisponível',
        detail: 'Esta inscrição não possui URL de pagamento salva.',
      });
      return;
    }

    navigator.clipboard.writeText(reg.checkoutUrl).then(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Link copiado',
          detail: reg.childName,
        });
      },
      () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro ao copiar',
          detail: 'Não foi possível copiar o link de pagamento.',
        });
      },
    );
  }

  isUpdating(reg: ExportedRegistration): boolean {
    return !!reg.paymentReferenceId &&
      this.updatingReferenceIds.has(reg.paymentReferenceId);
  }
}
