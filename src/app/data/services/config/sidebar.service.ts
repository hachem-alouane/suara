import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SidebarService {
  private readonly sideBarDesktopIsOpen$ = new BehaviorSubject(true);
  private readonly sideBarMobileIsOpen$ = new BehaviorSubject(false);

  get sideBarDesktopIsOpen() {
    return this.sideBarDesktopIsOpen$.asObservable();
  }

  changeSideBarDesktopIsOpen(status: boolean) {
    this.sideBarDesktopIsOpen$.next(status);
  }

  toggleSidebarDesktop() {
    this.sideBarDesktopIsOpen$.next(!this.sideBarDesktopIsOpen$.getValue());
  }

  get sideBarMobileIsOpen() {
    return this.sideBarMobileIsOpen$.asObservable();
  }

  changeSideBarMobileIsOpen(status: boolean) {
    this.sideBarMobileIsOpen$.next(status);
  }

  toggleSidebarMobile() {
    this.sideBarMobileIsOpen$.next(!this.sideBarMobileIsOpen$.getValue());
  }
}
