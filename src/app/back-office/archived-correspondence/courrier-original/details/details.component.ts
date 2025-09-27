import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EtatCourrier } from '../../../../core/enums/etat-courrier.enum';
import { DynamicDatePipe } from '../../../../shared/pipes/dynamic-date.pipe';
import { NewlineToBrPipe } from '../../../../shared/pipes/new-line.pipe';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [ButtonComponent, TranslateModule, DynamicDatePipe, NewlineToBrPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnDestroy {
  private readonly ref = inject(DynamicDialogRef);
  readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  readonly EtatCourrier = EtatCourrier;
  mail = this.dynamicDialogConfig.data?.mail;
  cancel() {
    this.ref.close();
  }

  ngOnDestroy(): void {
    if (this.ref) {
      this.ref.close();
    }
  }
}
