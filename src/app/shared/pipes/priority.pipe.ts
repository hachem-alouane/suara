import { Pipe, PipeTransform } from '@angular/core';
import { ListOfValueEtat } from '../../data/constants/list.constants';

@Pipe({
  name: 'priority',
  standalone: true,
})
export class PriorityPipe implements PipeTransform {
  transform(priority: string): string {
    return ListOfValueEtat[priority] ?? ListOfValueEtat['Default'];
  }
}
