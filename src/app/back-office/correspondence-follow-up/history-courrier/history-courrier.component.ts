import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UserAuthService } from '../../../data/services/auth/user-auth.service';
import { CourierService } from '../../../data/services/courier.service';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { TranslateModule } from '@ngx-translate/core';
import { BasicTableComponent } from '../../../shared/ui/basic-table/basic-table.component';
import { ICols } from '../../../core/models/table/cols.interface';
import { TableType } from '../../../core/models/table/table-type.enum';
import { finalize, shareReplay } from 'rxjs';

@Component({
  selector: 'app-history-courrier',
  standalone: true,
  imports: [ButtonComponent, TranslateModule, BasicTableComponent],
  templateUrl: './history-courrier.component.html',
  styleUrl: './history-courrier.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HistoryCourrierComponent implements OnDestroy, AfterViewInit {
  @ViewChild('table') table!: BasicTableComponent;

  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly userAuthService = inject(UserAuthService);
  private readonly courierService = inject(CourierService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly ref = inject(DynamicDialogRef);
  private readonly cdr = inject(ChangeDetectorRef);
  id = this.dynamicDialogConfig.data?.id;
  columns: ICols[] = [
    {
      header: 'EVENT_LOG',
      field: 'name',
      disableSort: true,
      type: TableType.CORRESPONDENCE_FOLLOW_UP,
    },
  ];
  loading = true;

  ngAfterViewInit(): void {
    this.listenToCurrentLanguage();
  }
  private listenToCurrentLanguage() {
    this.userAuthService.currentLanguage
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((language) => {
        this.getHistory(language);
      });
  }
  private getHistory(language: string) {
    this.courierService
      .historyCourrier(this.id, language)
      .pipe(
        finalize(() => {
          this.loading = false;
          setTimeout(() => {
            // this.cd.markForCheck();
          }, 100);
        }),
        shareReplay(1)
      )
      .subscribe({
        next: (data) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const formattedData: any[] = [];
          data?.forEach((element) => {
            formattedData.push({ name: element });
          });
          this.table.tableService.changeDataList(formattedData);
          this.cdr.markForCheck();
        },
        error: (_) => {
          this.ref.close(null);
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
