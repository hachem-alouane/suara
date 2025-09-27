import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class CustomTitleResolver {
  title = inject(Title);

  resolve() {
    return Promise.resolve(this.title.getTitle());
  }
}
