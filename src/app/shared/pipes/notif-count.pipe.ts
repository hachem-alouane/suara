import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'notifCount',
  standalone: true,
})
export class NotifiCountPipe implements PipeTransform {
  transform(count: number): string {
    return count > 99 ? '99+' : count.toString();
  }
}
