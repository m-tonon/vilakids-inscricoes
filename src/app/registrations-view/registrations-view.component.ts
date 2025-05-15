import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  NbCardModule,
  NbTreeGridModule,
  NbTreeGridDataSource,
  NbTreeGridDataSourceBuilder,
  NbSortDirection,
  NbSortRequest,
  NbInputModule,
} from '@nebular/theme';
import { RegistrationFormData } from '../../../shared/types';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface FSEntry {
  childName: string;
  age: string;
  responsibleName: string;
  phone?: number;
  paymentConfirmed?: boolean;
}

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [CommonModule, NbCardModule, NbTreeGridModule, NbInputModule],
  templateUrl: './registrations-view.component.html',
  styleUrl: './registrations-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationsViewComponent {
  dataSourceBuilder = inject(NbTreeGridDataSourceBuilder<FSEntry>);
  dataSource: NbTreeGridDataSource<FSEntry>;
  sortColumn?: string;
  sortDirection: NbSortDirection = NbSortDirection.NONE;
  selectedRegistration?: RegistrationFormData;

  customColumn = 'childName';
  displayedColumns = [
    'age',
    'responsibleName',
    'phone',
    'paymentConfirmed',
  ];
  allColumns = [ this.customColumn, ...this.displayedColumns ];

  columnDisplayNames: { [key: string]: string } = {
    childName: 'Nome da Criança',
    age: 'Idade',
    responsibleName: 'Nome do Responsável',
    phone: 'Telefone',
    paymentConfirmed: 'Pagamento Confirmado',
  };

  registrations: RegistrationFormData[] = [
    {
      childName: 'Thomas Tonon',
      birthDate: '01/05/2015',
      age: 8,
      gender: 'Masculino',
      identityDocument: '39454545',
      address: 'Rua Valéria, 421',
      churchMembership: '',
      churchName: '',
      healthInsurance: '',
      medications: '',
      allergies: '',
      specialNeeds: '',
      responsibleInfo: {
        name: 'Bel Tonon',
        phone: '44999999999',
        relation: 'Mãe',
        document: '42853987884',
        email: 'bel@hotmail.com',
      },
      parentalAuthorization: true,
      payment: {
        referenceId: 'REF-030RFK',
        paymentConfirmed: true,
        name: 'Bel Tonon',
        cpf: '42853987884',
        email: 'bel@hotmail.com',
        phone: '44999999999',
      },
    },
  ];

  data: TreeNode<FSEntry>[] = this.registrations.map(reg => ({
    data: {
      childName: reg.childName,
      age: reg.age.toString(),
      responsibleName: reg.responsibleInfo.name,
      phone: reg.responsibleInfo.phone ? Number(reg.responsibleInfo.phone) : undefined,
      paymentConfirmed: reg.payment?.paymentConfirmed ?? false,
    }
  }));

  constructor() {
    this.dataSource = this.dataSourceBuilder.create(this.data);
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + nextColumnStep * index;
  }

  onRowClick(row: any) {
    const reg = this.registrations.find(
      r => r.childName === row.data.childName
    );
    if (this.selectedRegistration === reg) {
      this.selectedRegistration = undefined;
    } else {
      this.selectedRegistration = reg;
    }
  }
}
