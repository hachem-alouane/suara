import { DOCUMENT } from '@angular/common';
import {
  Inject,
  inject,
  Injectable,
  Renderer2,
  RendererFactory2,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root',
})
export class LocaleService {
  private readonly translateService = inject(TranslateService);
  renderer!: Renderer2;

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
    rendererFactory: RendererFactory2
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
  }
  get currentLocale(): string {
    return this.translateService.currentLang;
  }

  initLocale(localeId: string, defaultLocaleId = localeId) {
    this.setDefaultLocale(defaultLocaleId);
    this.setLocale(localeId);
    this.renderer.setAttribute(this.document.documentElement, 'lang', localeId);
  }

  private setDefaultLocale(localeId: string) {
    this.translateService.setDefaultLang(localeId);
  }

  private setLocale(localeId: string) {
    this.translateService.use(localeId);
  }
  public translate(key: string) {
    return this.translateService.instant(key);
  }
}
