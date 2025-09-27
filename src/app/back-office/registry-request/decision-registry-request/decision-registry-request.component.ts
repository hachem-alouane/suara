/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { FieldsetModule } from 'primeng/fieldset';
import { LocaleService } from '../../../data/services/config/local.service';
import { DemandeService } from '../../../data/services/demande.service';
import { FocusInvalidInputDirective } from '../../../shared/directives/focus-first-invalid-input.directive';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { DropdownComponent } from '../../../shared/ui/dropdown/dropdown.component';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';
import { TextAreaComponent } from '../../../shared/ui/textarea/textarea.component';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-decision-registry-request',
  standalone: true,
  imports: [
    ButtonComponent,
    FocusInvalidInputDirective,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DropdownComponent,
    NgxDocViewerModule,
    TextAreaComponent,
    FieldsetModule,
  ],
  templateUrl: './decision-registry-request.component.html',
  styleUrl: './decision-registry-request.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, DialogUtilsService],
})
export class DecisionRegistryRequestComponent implements OnDestroy {
  ref2!: DynamicDialogRef;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly demandeService = inject(DemandeService);
  private readonly dialogUtilsService = inject(DialogUtilsService);
  private readonly localeService = inject(LocaleService);

  readonly ListOfDecisions = [
    {
      name: this.localeService.translate('ADDITIONAL_INFORMATION'),
      value: 'CI',
    },
    {
      name: this.localeService.translate('YES'),
      value: 'OUI',
    },
    {
      name: this.localeService.translate('NO'),
      value: 'non',
    },
  ];
  myForm: UntypedFormGroup = this.fb.group({});
  private readonly ref = inject(DynamicDialogRef);
  loading = false;
  register() {
    if (this.myForm?.invalid) return;
    this.loading = true;
    switch (this.myForm?.get('decsionformcontrol')?.value) {
      case 'OUI':
        this.demandeService
          .acceptDemandeBo(this.dynamicDialogConfig.data?.id)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: () => {
              this.ref.close({ type: 'accept' });
            },
            error: () => {
              this.dialogUtilsService.showErrorMessage();
            },
          });
        break;
      case 'non':
        this.demandeService
          .refuserDemandeBo(this.dynamicDialogConfig.data?.id)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: () => {
              this.ref.close({ type: 'refus' });
            },
            error: () => {
              this.dialogUtilsService.showErrorMessage();
            },
          });
        break;
      case 'CI':
        this.demandeService
          .ciDemandeBo(
            this.dynamicDialogConfig.data?.id,
            this.myForm?.get('description')?.value
          )
          .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: () => {
              this.ref.close({ type: 'ci' });
            },
            error: () => {
              this.dialogUtilsService.showErrorMessage();
            },
          });
        break;
      default:
        break;
    }
  }

  cancel() {
    this.ref.close();
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
