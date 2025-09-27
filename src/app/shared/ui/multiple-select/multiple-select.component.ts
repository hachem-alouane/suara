/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MultiSelectModule } from 'primeng/multiselect';
import { Tooltip } from 'primeng/tooltip';
import { ICols } from '../../../core/models/table/cols.interface';
import { LocaleService } from '../../../data/services/config/local.service';
import { ButtonComponent } from '../button/button.component';
import { DialogUtilsService } from '../services/dialogue/dialogue-util.service';
import { InputService } from '../services/form/input.service';
import { DetailsViewComponent } from './details-view/details-view.component';

@Component({
  selector: 'app-multiple-select',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    MultiSelectModule,
    Tooltip,
    SvgIconComponent,
    TranslateModule,
    ButtonComponent,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  providers: [InputService, DialogService, DialogUtilsService],

  templateUrl: './multiple-select.component.html',
  styleUrl: './multiple-select.component.scss',
})
export class MultipleSelectComponent implements OnInit {
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
  @Input() columnsViewMode: ICols[] = [];
  @Input() dataViewMode: any[] = [];

  readonly inputService = inject(InputService);
  readonly destroyRef = inject(DestroyRef);
  readonly localeService = inject(LocaleService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  ref!: DynamicDialogRef;

  private readonly fb = inject(NonNullableFormBuilder);
  myFormDropdown = this.fb.group({});

  ngOnInit(): void {
    if (!this.isFormArray) this.initControl();
  }

  private initControl() {
    this.inputService.initControl(this.controlName, {
      defaultValue: this.defaultValue,
      disabled: this.isDisabled,
      isRequired: this.isRequired,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any

  showView() {
    this.dialogUtilsService
      .openDialog(
        DetailsViewComponent,
        this.localeService.translate(this.placeholder),
        {
          columnsViewMode: this.columnsViewMode,
          dataViewMode: this.dataViewMode,
        },
        false,
        'w-10'
      )
      .subscribe((ref) => {
        this.ref = ref;
      });
  }
}
