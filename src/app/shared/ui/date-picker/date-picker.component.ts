import { AsyncPipe } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { Tooltip } from 'primeng/tooltip';
import { Observable, shareReplay } from 'rxjs';
import { InputService } from '../services/form/input.service';
import { BreackpointService } from '../services/breakpoints/breakpoint.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-date-picker',
  standalone: true,
  imports: [
    DatePickerModule,
    AsyncPipe,
    SvgIconComponent,
    ReactiveFormsModule,
    FormsModule,
    ButtonModule,
    Tooltip,
    TranslateModule,
  ],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true }),
    },
  ],
  providers: [InputService],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
})
export class DatePickerComponent implements OnInit {
  @Input({ required: true }) controlName = '';
  @Input() variant: 'in' | 'over' | 'on' = 'over';
  @Input() selectionMode: 'single' | 'multiple' | 'range' | undefined =
    'single';
  @Input() showButtonBar = true;
  @Input() label = '';
  @Input() isRequired = false;
  @Input() placeholder = '--/--/----';
  @Input() inputStyleClass = '';
  @Input() styleClassLabel = '';
  @Input() maxDate = false;
  @Input() minDate = false;
  @Input() tooltip = false;
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'top';
  @Input() tooltipText = '';
  @Input() view: 'date' | 'month' | 'year' = 'date';
  @Input() isFormArray = false;
  @Input() customError = false;
  @Input() customDateFormat = 'dd/mm/yy';
  @Input() isDisabled = false;

  isMobileOrTablet$!: Observable<boolean>;

  readonly inputService = inject(InputService);
  private readonly breackpointService = inject(BreackpointService);

  ngOnInit(): void {
    this.listenToIsMobileOrTablet();
    if (!this.isFormArray) this.initControl();
  }

  private initControl() {
    this.inputService.initControl(this.controlName, {
      isRequired: this.isRequired,
      disabled: this.isDisabled,
    });
  }
  private listenToIsMobileOrTablet() {
    this.isMobileOrTablet$ =
      this.breackpointService.breakpointIsMobileOrTablet$.pipe(shareReplay(1));
  }
}
