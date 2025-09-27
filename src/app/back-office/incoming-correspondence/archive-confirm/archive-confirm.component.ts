/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import {
  FormsModule,
  NonNullableFormBuilder,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { finalize } from 'rxjs';
import { LocaleService } from '../../../data/services/config/local.service';
import { CourierService } from '../../../data/services/courier.service';
import { FocusInvalidInputDirective } from '../../../shared/directives/focus-first-invalid-input.directive';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { DropdownComponent } from '../../../shared/ui/dropdown/dropdown.component';
import { DialogUtilsService } from '../../../shared/ui/services/dialogue/dialogue-util.service';

@Component({
  selector: 'app-archive-confirm',
  standalone: true,
  imports: [
    ButtonComponent,
    FocusInvalidInputDirective,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NgxDocViewerModule,
    DropdownComponent,
  ],
  templateUrl: './archive-confirm.component.html',
  styleUrl: './archive-confirm.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [DialogService, DialogUtilsService],
})
export class ArchiveConfirmComponent implements OnDestroy {
  ref2!: DynamicDialogRef;

  private readonly fb = inject(NonNullableFormBuilder);
  private readonly http = inject(HttpClient);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly courierService = inject(CourierService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly localeService = inject(LocaleService);
  private readonly dialogUtilsService = inject(DialogUtilsService);

  myForm = this.fb.group<any>({});
  private readonly ref = inject(DynamicDialogRef);
  loading = false;
  listOfProrities = [
    {
      id: 1,
      name: this.localeService.translate('NORMAL'),
      value: 'NORMALE',
    },
    {
      id: 2,
      name: this.localeService.translate('URGENT'),
      value: 'URGENTE',
    },
    {
      id: 3,
      name: this.localeService.translate('VERY_URGENT'),
      value: 'TRES_URGENTE',
    },
  ];

  archive() {
    if (this.myForm.invalid) return;
    this.loading = true;
    this.courierService
      .archive(
        this.dynamicDialogConfig.data?.id,
        this.myForm?.get('priority')?.getRawValue()
      )
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (_) => {
          this.ref.close(true);
        },
        error: (_) => {
          this.dialogUtilsService.showErrorMessage();
        },
      });
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
