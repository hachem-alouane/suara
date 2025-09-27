import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { Select, SelectModule } from 'primeng/select';
import { Tooltip } from 'primeng/tooltip';
import { TableType } from '../../../core/models/table/table-type.enum';
import { InputComponent } from '../input/input.component';
import { InputService } from '../services/form/input.service';
import { DropdownPaginateService } from '../services/table/dropdown-paginate.service';

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    SelectModule,
    Tooltip,
    SvgIconComponent,
    TranslateModule,
    InputComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  providers: [InputService, DropdownPaginateService],

  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.scss',
})
export class DropdownComponent implements OnInit, AfterViewInit {
  @ViewChild('focusable', { static: true })
  dropdownRef!: Select;

  @Input() label = '';
  @Input() placeholder = '';
  @Input({ required: true }) controlName = '';
  @Input() optionLabel: undefined | string = undefined;
  @Input() optionValue: undefined | string = undefined;
  @Input() isRequired = false;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  @Input({ required: true }) listValues: any[] = [];
  @Input() filter = false;
  @Input() filterBy = '';
  @Input() styleClass = '';
  @Input() styleClassLabel = '';
  @Input() size: 'small' | 'large' = 'large';
  @Input() tooltip = false;
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'top';
  @Input() tooltipText = '';
  @Input() isFormArray = false;
  @Input() customError = false;
  @Input() iconLabel = '';
  @Input() isDisabled = false;
  @Input() defaultValue: string | number | boolean | null = null;
  @Input() paginated = false;
  @Input() tableType: TableType = TableType.ORGANIZATION;

  readonly inputService = inject(InputService);
  readonly dropdownPaginateService = inject(DropdownPaginateService);
  readonly destroyRef = inject(DestroyRef);

  private readonly fb = inject(NonNullableFormBuilder);
  myFormDropdown = this.fb.group({});

  ngOnInit(): void {
    if (!this.isFormArray) this.initControl();
  }
  ngAfterViewInit(): void {
    if (this.paginated) {
      this.filterBy = 'null';
      this.dropdownPaginateService.initPaginate(
        this.tableType,
        this.myFormDropdown
      );
    }
  }
  getFocusableElement(): HTMLElement {
    return this.dropdownRef.focusInputViewChild?.nativeElement;
  }
  private initControl() {
    this.inputService.initControl(this.controlName, {
      defaultValue: this.defaultValue,
      disabled: this.isDisabled,
      isRequired: this.isRequired,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}
