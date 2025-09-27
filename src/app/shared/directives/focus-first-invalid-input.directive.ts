import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  NgZone,
} from '@angular/core';

@Directive({
  selector: '[appFocusInvalidInput]',
  standalone: true,
})
export class FocusInvalidInputDirective {
  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);

  @HostListener('ngSubmit')
  onFormSubmit() {
    this.ngZone.runOutsideAngular(() => {
      const form = this.elementRef.nativeElement as HTMLElement;

      const observer = new MutationObserver(() => {
        const invalidControl = form.querySelector<HTMLElement>('.ng-invalid');

        if (invalidControl) {
          observer.disconnect(); // Stop observing once found

          const targetToFocus =
            invalidControl.firstElementChild instanceof HTMLElement
              ? invalidControl.firstElementChild
              : invalidControl;

          targetToFocus.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
          });

          // Run inside Angular to trigger CD if needed
          this.ngZone.run(() => {
            targetToFocus.focus();
          });
        }
      });

      // Observe DOM mutations to detect when .ng-invalid appears
      observer.observe(form, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['class'],
      });

      // Fallback: stop observer after a while to avoid memory leaks
      setTimeout(() => observer.disconnect(), 3000);
    });
  }
}
