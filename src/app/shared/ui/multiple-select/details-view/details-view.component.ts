import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { BasicTableComponent } from '../../basic-table/basic-table.component';
import { ButtonComponent } from '../../button/button.component';

@Component({
  selector: 'app-details-view',
  standalone: true,
  imports: [ButtonComponent, TranslateModule, BasicTableComponent],
  templateUrl: './details-view.component.html',
  styleUrl: './details-view.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsViewComponent implements AfterViewInit, OnDestroy {
  @ViewChild('table') table!: BasicTableComponent;
  private readonly ref = inject(DynamicDialogRef);
  private readonly dynamicDialogConfig = inject(DynamicDialogConfig);
  private readonly cdr = inject(ChangeDetectorRef);
  columnsViewMode = this.dynamicDialogConfig.data?.columnsViewMode;
  dataViewMode = this.dynamicDialogConfig.data?.dataViewMode;
  showTable = false;
  loading = true;
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.table.tableService.changeDataList(this.dataViewMode);
      this.showTable = true;
      this.loading = false;
      this.cdr.markForCheck();
    }, 500);
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
