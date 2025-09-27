import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'searchHighlight',
  standalone: true,
})
export class SearchHighlightPipe implements PipeTransform {
  private readonly sanitizer = inject(DomSanitizer);
  transform(
    value: string | null | undefined,
    search: string,
    searchHighlightColumns: string[],
    fieldName: string
  ): SafeHtml {
    if (!value) return '';
    if (
      !search ||
      !searchHighlightColumns?.length ||
      !searchHighlightColumns.includes(fieldName)
    ) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }

    const pattern = search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
    const regex = new RegExp(`(${pattern})`, 'gi');
    const highlighted = value.replace(regex, `<mark>$1</mark>`);
    return this.sanitizer.bypassSecurityTrustHtml(highlighted);
  }
}
