import {
  AfterViewInit,
  Directive,
  ElementRef,
  inject,
  OnDestroy,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appDragScroll]',
  standalone: true,
})
export class DragScrollDirective implements AfterViewInit, OnDestroy {
  private readonly el = inject(ElementRef);
  private readonly renderer = inject(Renderer2);
  private isDragging = false;
  private startX = 0;
  private scrollLeft = 0;

  private mouseMoveListener?: () => void;
  private mouseUpListener?: () => void;
  private mouseDownListener?: () => void;

  private scrollContainer!: HTMLElement;

  ngAfterViewInit(): void {
    const hostElement = this.el.nativeElement as HTMLElement;
    this.scrollContainer = hostElement.querySelector(
      '.p-datatable-table-container'
    )!;

    this.renderer.setStyle(this.scrollContainer, 'cursor', 'grab');

    this.mouseDownListener = this.renderer.listen(
      this.scrollContainer,
      'mousedown',
      (e: MouseEvent) => {
        this.isDragging = true;
        this.startX = e.pageX - this.scrollContainer.offsetLeft;
        this.scrollLeft = this.scrollContainer.scrollLeft;
        this.renderer.setStyle(this.scrollContainer, 'cursor', 'grabbing');

        this.mouseMoveListener = this.renderer.listen(
          'window',
          'mousemove',
          (e: MouseEvent) => {
            if (!this.isDragging) return;
            const x = e.pageX - this.scrollContainer.offsetLeft;
            const walk = x - this.startX;
            this.scrollContainer.scrollLeft = this.scrollLeft - walk;
          }
        );

        this.mouseUpListener = this.renderer.listen('window', 'mouseup', () => {
          this.isDragging = false;
          this.renderer.setStyle(this.scrollContainer, 'cursor', 'grab');
          this.mouseMoveListener?.();
          this.mouseUpListener?.();
        });
      }
    );
  }

  ngOnDestroy(): void {
    this.mouseDownListener?.();
    this.mouseMoveListener?.();
    this.mouseUpListener?.();
  }
}
