/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { PickListModule } from 'primeng/picklist';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { InputComponent } from '../input/input.component';
import { ModuleTagPipe } from '../../pipes/module-tag.pipe';

@Component({
  selector: 'app-picklist',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PickListModule,
    TooltipModule,
    SvgIconComponent,
    TranslateModule,
    TagModule,
    InputComponent,
    ModuleTagPipe,
  ],
  templateUrl: './picklist.component.html',
})
export class PicklistComponent {
  @Input() label = '';
  @Input() iconLabel = '';
  @Input() isRequired = false;
  @Input() rtl = false;
  @Input() tooltip = false;
  @Input() tooltipText = '';
  @Input() tooltipPosition: 'right' | 'left' | 'top' | 'bottom' = 'top';
  @Input() styleClassLabel = '';

  @Input({ required: true }) source: any[] = [];
  @Input({ required: true }) target: any[] = [];

  @Input() filterBy: string | undefined = undefined;
  @Input() sourceFilterPlaceholder = 'SEARCH';
  @Input() targetFilterPlaceholder = 'SEARCH';
  @Input() dragdrop = true;
  @Input() showControls = true;
  @Input() responsive = true;
  @Input() breakpoint = '1400px';
  @Input() listHeight = '26rem';
  @Input() styleClass = '';
  @Input() sourceHeader = '';
  @Input() targetHeader = '';
}
