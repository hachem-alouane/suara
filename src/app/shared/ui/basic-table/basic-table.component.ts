/* eslint-disable @typescript-eslint/no-explicit-any */
import { AsyncPipe, CommonModule } from '@angular/common';
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
import { DialogModule } from 'primeng/dialog';
import { Table, TableModule } from 'primeng/table';
import { Observable } from 'rxjs';
import { BasicTableType } from '../../../core/enums/table-type.enum';
import { TranslateModule } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import {
  ActionMenu,
  ActionMenuType,
} from '../../../core/models/table/actions-menu.enum';
import { ICols } from '../../../core/models/table/cols.interface';
import { ExtrasColumn } from '../../../core/models/table/extras_column.enum';
import { UserAuthService } from '../../../data/services/auth/user-auth.service';
import { LocaleService } from '../../../data/services/config/local.service';
import { DragScrollDirective } from '../../directives/drag-scroll.directive';
import { ActionsFirstPipe } from '../../pipes/actions-first-mobile.pipe';
import { DynamicDatePipe } from '../../pipes/dynamic-date.pipe';
import { ButtonComponent } from '../../ui/button/button.component';
import { BreackpointService } from '../services/breakpoints/breakpoint.service';
import { BasicTableService } from '../services/table/basic-table.service';
@Component({
  selector: 'app-basic-table',
  standalone: true,
  imports: [
    ButtonComponent,
    TableModule,
    ReactiveFormsModule,
    FormsModule,
    AsyncPipe,
    ActionsFirstPipe,
    DialogModule,
    DynamicDatePipe,
    SkeletonModule,
    Menu,
    TranslateModule,
    TagModule,
    PaginatorModule,
    DragScrollDirective,
    CommonModule,
  ],
  providers: [BasicTableService],
  templateUrl: './basic-table.component.html',
  styleUrl: './basic-table.component.scss',
})
export class BasicTableComponent implements OnInit {
  @ViewChild('dt') dt!: Table;
  @Input({ required: true }) columns: ICols[] = [];
  @Input() showEmptyTable = true;
  @Input() actions: ActionMenuType[] = [];
  @Input({ required: true }) loading = true;
  @Input() styleClassHeader = '';
  @Output() updateEv = new EventEmitter<{
    data: any;
  }>();
  @Output() showEv = new EventEmitter<{
    data: any;
  }>();
  @Output() addReqEv = new EventEmitter<{
    data: any;
  }>();
  menuItems: MenuItem[] = [];
  selectedItemMenu!: any;
  isMobileOrTablet$!: Observable<boolean>;
  readonly userAuthService = inject(UserAuthService);
  readonly destroyRef = inject(DestroyRef);
  private readonly breackpointService = inject(BreackpointService);
  readonly tableService = inject(BasicTableService);
  readonly ExtrasColumn = ExtrasColumn;
  readonly basicTableService = inject(BasicTableService);
  readonly localeService = inject(LocaleService);
  ngOnInit(): void {
    this.listenToIsMobileOrTablet();
    this.initTable();
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
    //  if (
    //   this.tableService.typeTable ===
    //     TableType.CANDIDATES_INNOVATIONS_SECRETERIAT &&
    //   itemMenu?.sendAccuseReception === true
    // ) {
    //   this.menuItems = this.menuItems.filter(
    //     (item) => item.label !== "Envoyer l'accusé de réception"
    //   );
  }
  private setupMenuActions() {
    this.actions.forEach((action) => {
      switch (action) {
        case ActionMenu.EDIT:
          this.menuItems.push({
            label: 'Modifier',
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
        case ActionMenu.ADD_REQUEST:
          this.menuItems.push({
            label: this.localeService.translate('ADD_REQUEST'),
            icon: 'pi pi-plus',
            iconClass: 'text-blue-500',
            styleClass: 'text-base  ',
            command: () => {
              this.addReqEv.emit({
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
  private initTable() {
    this.tableService.initTable(BasicTableType.CONTACTS);
  }
  private listenToIsMobileOrTablet() {
    this.isMobileOrTablet$ =
      this.breackpointService.breakpointIsMobileOrTablet$;
  }
}
