/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe, CommonModule, DatePipe, NgStyle } from '@angular/common';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { MenuItem, SortMeta } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { Menu } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { Table, TableModule } from 'primeng/table';

import { TagModule } from 'primeng/tag';
import { Tooltip } from 'primeng/tooltip';
import { Observable } from 'rxjs';

import { TranslateModule } from '@ngx-translate/core';
import { SkeletonModule } from 'primeng/skeleton';
import {
  ActionMenu,
  ActionMenuType,
} from '../../../core/models/table/actions-menu.enum';
import { ICols } from '../../../core/models/table/cols.interface';
import { ExtrasColumn } from '../../../core/models/table/extras_column.enum';
import { ISortOrderNgPrime } from '../../../core/models/table/sort-order-ngprime.enum';
import { TableType } from '../../../core/models/table/table-type.enum';
import { UserAuthService } from '../../../data/services/auth/user-auth.service';
import { LocaleService } from '../../../data/services/config/local.service';
import { DragScrollDirective } from '../../directives/drag-scroll.directive';
import { ActionsFirstPipe } from '../../pipes/actions-first-mobile.pipe';
import { DynamicDatePipe } from '../../pipes/dynamic-date.pipe';
import { SearchHighlightPipe } from '../../pipes/search-highlight.pipe';
import { ButtonComponent } from '../../ui/button/button.component';
import { LinkButtonComponent } from '../../ui/link-button/link-button.component';
import { BreackpointService } from '../services/breakpoints/breakpoint.service';
import { TableService } from '../services/table/table.service';
import { EtatCourrier } from '../../../core/enums/etat-courrier.enum';
import { StatutDemande } from '../../../core/enums/status-demande.enum';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    ButtonComponent,
    SvgIconComponent,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    PaginatorModule,
    AsyncPipe,
    ActionsFirstPipe,
    DatePipe,
    Menu,
    DialogModule,
    TagModule,
    SearchHighlightPipe,
    DragScrollDirective,
    TranslateModule,
    Tooltip,
    LinkButtonComponent,
    DynamicDatePipe,
    SkeletonModule,
    NgStyle,
    CommonModule,
    NgStyle,
  ],
  providers: [TableService],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
})
export class TableComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  @Input({ required: true }) columns: ICols[] = [];
  @Input() actions: ActionMenuType[] = [];
  @Input() titleTable = '';
  @Input() showAddBtn = true;
  @Input() searchHighlightColumns: string[] = [];
  @Output() enableEv = new EventEmitter<{
    data: any;
  }>();
  @Output() blockEv = new EventEmitter<{
    data: any;
  }>();
  @Output() deactivateEv = new EventEmitter<{
    data: any;
  }>();
  @Output() sendMailEv = new EventEmitter<{
    data: any;
  }>();
  @Output() updateEv = new EventEmitter<{
    data: any;
  }>();
  @Output() showEv = new EventEmitter<{
    data: any;
  }>();
  @Output() sendEv = new EventEmitter<{
    data: any;
  }>();
  @Output() deleteEv = new EventEmitter<{
    data: any;
  }>();
  @Output() sendDeliberationEv = new EventEmitter<{
    data: any;
  }>();
  @Output() transferEv = new EventEmitter<{
    data: any;
  }>();
  @Output() decisionEv = new EventEmitter<{
    data: any;
  }>();
  @Output() destributionEv = new EventEmitter<{
    data: any;
  }>();
  @Output() addRequestEv = new EventEmitter<{
    data: any;
  }>();
  @Output() processingRequestEv = new EventEmitter<{
    data: any;
  }>();
  @Output() restoreEv = new EventEmitter<{
    data: any;
  }>();
  @Output() addEv = new EventEmitter<Event>();

  @Output() correspondenceLogTrackingEv = new EventEmitter<{
    data: any;
  }>();
  @Output() permissionEv = new EventEmitter<{
    data: any;
  }>();
  menuItems: MenuItem[] = [];
  selectedItemMenu!: any;
  isMobileOrTablet$!: Observable<boolean>;

  private readonly breackpointService = inject(BreackpointService);
  readonly tableService = inject(TableService);
  readonly localeService = inject(LocaleService);
  readonly userAuthService = inject(UserAuthService);
  readonly destroyRef = inject(DestroyRef);
  readonly ExtrasColumn = ExtrasColumn;

  ngOnInit(): void {
    this.listenToIsMobileOrTablet();
    if (this.actions.length) {
      this.setupMenuActions();
    }
  }

  resetMenuItems() {
    this.menuItems = [];
    this.setupMenuActions();
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  selectItemMenu(itemMenu: any) {
    this.selectedItemMenu = itemMenu;
    if (
      this.tableService.typeTable === TableType.USERS &&
      itemMenu?.activated === 'ACTIVE'
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'ACTIVATE'
      );
    } else if (
      this.tableService.typeTable === TableType.USERS &&
      itemMenu?.activated === 'BLOCKED'
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'BLOCK'
      );
    }
    if (
      this.tableService.typeTable === TableType.INCOMING_CORRESPONDENCE &&
      itemMenu?.courrierAvecDemande === false
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'DECISION'
      );
    } else if (
      this.tableService.typeTable === TableType.INCOMING_CORRESPONDENCE &&
      itemMenu?.courrierAvecDemande === true
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'TRASH' && item?.['ref'] !== 'TRANSFER'
      );
    }
    if (
      (this.tableService.typeTable === TableType.ORGANIZATION ||
        this.tableService.typeTable === TableType.COUNTRY ||
        this.tableService.typeTable === TableType.SUB_ORGANIZATION ||
        this.tableService.typeTable === TableType.GROUP ||
        this.tableService.typeTable === TableType.MAIL_TEMPLATE ||
        this.tableService.typeTable === TableType.MEMBER) &&
      itemMenu?.statut === 'ACTIVE'
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'ACTIVATE'
      );
    } else if (
      (this.tableService.typeTable === TableType.ORGANIZATION ||
        this.tableService.typeTable === TableType.COUNTRY ||
        this.tableService.typeTable === TableType.SUB_ORGANIZATION ||
        this.tableService.typeTable === TableType.MAIL_TEMPLATE ||
        this.tableService.typeTable === TableType.MEMBER) &&
      itemMenu?.statut === 'DISABLED'
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'DEACTIVATE' && item?.['ref'] !== 'UPDATE'
      );
    }
    if (
      this.tableService.typeTable === TableType.GROUP &&
      itemMenu?.flag === 'ACTIVE'
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'ACTIVATE'
      );
    } else if (
      this.tableService.typeTable === TableType.GROUP &&
      itemMenu?.flag === 'DISABLED'
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'DEACTIVATE' && item?.['ref'] !== 'UPDATE'
      );
    }
    if (
      this.tableService.typeTable === TableType.DISTRIBUTED_CORRESPONDENCE &&
      itemMenu?.etatCourrier === EtatCourrier.COMPLIMENT_INFORMATION
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'ADD_REQUEST'
      );
    } else if (
      this.tableService.typeTable === TableType.DISTRIBUTED_CORRESPONDENCE &&
      itemMenu?.etatCourrier === EtatCourrier.DISTRIBUE
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'PROCESSING_REQUEST'
      );
    }
    if (
      this.tableService.typeTable === TableType.REGISTRY_REQUEST &&
      (itemMenu?.statutDemande === StatutDemande.ACCEPTEE ||
        itemMenu?.statutDemande === StatutDemande.REFUSEE ||
        itemMenu?.statutDemande === StatutDemande.COMPLIMENT_INFORMATION)
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'DECISION'
      );
    }
    if (
      (this.tableService.typeTable === TableType.REGISTRY_REQUEST &&
        itemMenu?.statutDemande === StatutDemande.NOUVEAU) ||
      itemMenu?.statutDemande === StatutDemande.ACCEPTEE ||
      itemMenu?.statutDemande === StatutDemande.REFUSEE ||
      itemMenu?.statutDemande === StatutDemande.TRAITE
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'PROCESSING_REQUEST'
      );
    }
    if (
      this.tableService.typeTable === TableType.ARCHIVED_CORRESPONDENCE &&
      itemMenu?.etatCourrier !== 'ARCHIVE'
    ) {
      this.menuItems = this.menuItems.filter(
        (item) => item?.['ref'] !== 'DISTRIBUTION'
      );
    }
  }
  private setupMenuActions() {
    this.actions.forEach((action) => {
      switch (action) {
        case ActionMenu.EDIT:
          this.menuItems.push({
            ref: 'UPDATE',
            label: this.localeService.translate('UPDATE'),
            icon: 'pi pi-pencil',
            iconClass: 'text-blue-500',
            styleClass: 'text-base  ',
            command: () => {
              this.updateEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.VIEW:
          this.menuItems.push({
            ref: 'CONSULT',
            label: this.localeService.translate('CONSULT'),
            icon: 'pi pi-eye',
            iconClass: 'text-purple-500',
            styleClass: 'text-base  ',
            command: () => {
              this.showEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;

        case ActionMenu.ENABLE:
          this.menuItems.push({
            ref: 'ACTIVATE',
            label: this.localeService.translate('ACTIVATE'),
            icon: 'pi pi-unlock',
            iconClass: 'text-green-500',
            styleClass: 'text-base  ',
            command: () => {
              this.enableEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.BLOCK:
          this.menuItems.push({
            ref: 'BLOCK',
            label: this.localeService.translate('BLOCK'),
            icon: 'pi pi-lock',
            iconClass: 'text-red-500',
            styleClass: 'text-base  ',
            command: () => {
              this.blockEv.emit({
                data: this.selectedItemMenu,
              });
              // this.router.navigate([
              //   this.currentRoute + '/edit/' + this.selectedItemMenu?.id,
              // ]);
            },
          });
          break;
        case ActionMenu.TRANSFER:
          this.menuItems.push({
            ref: 'TRANSFER',
            label: this.localeService.translate('ARCHIVEE'),
            icon: 'pi pi-send',
            iconClass: 'text-blue-500',
            styleClass: 'text-base  ',
            command: () => {
              this.transferEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.DELETE:
          this.menuItems.push({
            ref: 'TRASH',
            label: this.localeService.translate('TRASH'),
            icon: 'pi pi-trash',
            iconClass: 'text-red-500',
            styleClass: 'text-base  ',
            command: () => {
              this.deleteEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.DECISION:
          this.menuItems.push({
            ref: 'DECISION',
            label: this.localeService.translate('DECISION'),
            icon: 'pi pi-check-square',
            iconClass: 'text-pink-500',
            styleClass: 'text-base  ',
            command: () => {
              this.decisionEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.DISTRIBUTION:
          this.menuItems.push({
            ref: 'DISTRIBUTION',
            label: this.localeService.translate('DISTRIBUTION'),
            icon: 'pi pi-send',
            iconClass: 'text-blue-500',
            styleClass: 'text-base  ',
            command: () => {
              this.destributionEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.ADD_REQUEST:
          this.menuItems.push({
            ref: 'ADD_REQUEST',
            label: this.localeService.translate('ADD_REQUEST'),
            icon: 'pi pi-plus',
            iconClass: 'text-teal-500',
            styleClass: 'text-base  ',
            command: () => {
              this.addRequestEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.PROCESSING_REQUEST:
          this.menuItems.push({
            ref: 'PROCESSING_REQUEST',
            label: this.localeService.translate('PROCESSING_REQUEST'),
            icon: 'pi pi-refresh',
            iconClass: 'text-cyan-400',
            styleClass: 'text-base  ',
            command: () => {
              this.processingRequestEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.DEACTIVATE:
          this.menuItems.push({
            ref: 'DEACTIVATE',
            label: this.localeService.translate('DEACTIVATE'),
            icon: 'pi pi-lock',
            iconClass: 'text-red-500',
            styleClass: 'text-base  ',
            command: () => {
              this.deactivateEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.SEND_EMAIL:
          this.menuItems.push({
            ref: 'SEND_EMAIL',
            label: this.localeService.translate('SEND_EMAILL'),
            icon: 'pi pi-send',
            iconClass: 'text-blue-500',
            styleClass: 'text-base  ',
            command: () => {
              this.sendMailEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.RESTORE:
          this.menuItems.push({
            ref: 'RESTORE',
            label: this.localeService.translate('RESTORE'),
            icon: 'pi pi-replay',
            iconClass: 'text-green-500',
            styleClass: 'text-base',
            command: () => {
              this.restoreEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.PERMISSION:
          this.menuItems.push({
            ref: 'PERMISSION',
            label: this.localeService.translate('PERMISSION'),
            icon: 'pi pi-lock-open',
            iconClass: 'text-purple-500',
            styleClass: 'text-base',
            command: () => {
              this.permissionEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;
        case ActionMenu.CORRESPONDENCE_LOG_TRACKING:
          this.menuItems.push({
            ref: 'CORRESPONDENCE_LOG_TRACKING',
            label: this.localeService.translate('CORRESPONDENCE_LOG_TRACKING'),
            icon: 'pi pi-book', // ou 'pi pi-history' pour représenter un suivi/trace
            iconClass: 'text-orange-500', // couleur différente pour distinguer
            styleClass: 'text-base',
            command: () => {
              this.correspondenceLogTrackingEv.emit({
                data: this.selectedItemMenu,
              });
            },
          });
          break;

        default:
          break;
      }
    });
  }

  onSort(event: SortMeta) {
    if (
      (this.tableService.sortBy === event?.field ||
        this.tableService.sortBy == 'prioriteCourrier') &&
      event?.order == ISortOrderNgPrime.ASC
    ) {
      this.tableService.clear();
      this.dt.reset();
      return;
    }
    this.tableService.sort(event);
  }
  private listenToIsMobileOrTablet() {
    this.isMobileOrTablet$ =
      this.breackpointService.breakpointIsMobileOrTablet$;
  }
}
