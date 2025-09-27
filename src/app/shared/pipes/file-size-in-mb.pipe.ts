import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileSizeInMb',
  standalone: true,
})
export class FileSizeInMbPipe implements PipeTransform {
  transform(value: number): string {
    if (value < 1024 * 1024) {
      return `${(value / 1024).toFixed(2)} KB`;
    } else if (value < 1024 * 1024 * 1024) {
      return `${(value / (1024 * 1024)).toFixed(2)} MB`;
    } else {
      return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
  }
}
