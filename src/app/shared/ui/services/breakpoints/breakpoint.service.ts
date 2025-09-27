import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { inject, Injectable } from '@angular/core';
import { distinctUntilChanged, map, tap } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BreackpointService {
  Breakpoints = Breakpoints;
  private readonly breakpointObserver = inject(BreakpointObserver);
  readonly breakpointIsDesktop$ = this.breakpointObserver
    .observe([Breakpoints.XLarge, Breakpoints.Large, Breakpoints.Medium])
    .pipe(
      tap(),
      distinctUntilChanged(),
      map((a) => a.matches)
    );
  readonly breakpointIsMobileOrTablet$ = this.breakpointObserver
    .observe([Breakpoints.Small, Breakpoints.XSmall])
    .pipe(
      tap(),
      distinctUntilChanged(),
      map((a) => a.matches)
    );
  readonly breakpointIsMobile$ = this.breakpointObserver
    .observe([Breakpoints.XSmall])
    .pipe(
      tap(),
      distinctUntilChanged(),
      map((a) => a.matches)
    );
}
