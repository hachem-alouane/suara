import { Pipe, PipeTransform } from '@angular/core';
import { ICols } from '../../core/models/table/cols.interface';
@Pipe({
  name: 'actionsFirst',
  standalone: true,
  pure: true,
})
export class ActionsFirstPipe implements PipeTransform {
  transform(cols: ICols[], isMobile: boolean | null): ICols[] {
    if (isMobile) {
      const sortedCols = cols.slice().sort((colprev, colnext) => {
        if (colprev.field === 'actions' && colnext.field !== 'actions') {
          return -1;
        }
        if (colprev.field !== 'actions' && colnext.field === 'actions') {
          return 1;
        }
        return 0;
      });
      return sortedCols;
    }
    return cols;
  }
}
