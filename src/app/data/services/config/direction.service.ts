import { DOCUMENT } from '@angular/common';
import { Inject, Injectable, Renderer2, RendererFactory2 } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DirectionTheme } from '../../../core/enums/direction-theme.enum';

@Injectable({
  providedIn: 'root',
})
export class DirectionService {
  public isRtl$ = new BehaviorSubject(false);
  renderer!: Renderer2;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  changeIsRtl(state: boolean) {
    this.isRtl$.next(state);
    this.changeStyles(this.isRtl$.getValue());
  }
  toggleIsRtl() {
    this.isRtl$.next(!this.isRtl$.getValue());
    this.changeStyles(this.isRtl$.getValue());
  }
  get isRtl() {
    return this.isRtl$.asObservable();
  }
  changeStyles(mode: boolean) {
    this.renderer.setAttribute(
      this.document.documentElement,
      'dir',
      mode ? DirectionTheme.RTL : DirectionTheme.LTR
    );
    this.renderer.setAttribute(
      this.document.documentElement,
      'direction',
      mode ? DirectionTheme.RTL : DirectionTheme.LTR
    );
    this.renderer.setAttribute(
      this.document.body,
      'dir',
      mode ? DirectionTheme.RTL : DirectionTheme.LTR
    );
    this.renderer.setAttribute(
      this.document.body,
      'direction',
      mode ? DirectionTheme.RTL : DirectionTheme.LTR
    );
  }
}
