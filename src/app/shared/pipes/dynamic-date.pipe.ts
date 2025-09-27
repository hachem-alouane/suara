import { DatePipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Language } from '../../core/enums/language.enum';
@Pipe({
  name: 'dynamicDate',
  standalone: true,
  pure: false,
})
export class DynamicDatePipe implements PipeTransform {
  private readonly translate = inject(TranslateService);

  transform(
    value: Date | string | number,
    format = 'd MMM y ,HH:mm:ss'
  ): string | null {
    const currentLocale = this.translate.currentLang || Language.AR;
    const datePipe = new DatePipe(currentLocale);
    return datePipe.transform(value, format);
  }
}
