import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Drawer, DrawerModule } from 'primeng/drawer';
import { Observable } from 'rxjs';
import { SidebarService } from '../../../../data/services/config/sidebar.service';
import { StyleClass } from 'primeng/styleclass';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { LinkButtonComponent } from '../../../../shared/ui/link-button/link-button.component';
import { SidebarContentComponent } from './sidebar-content/sidebar-content.component';
import { DirectionService } from '../../../../data/services/config/direction.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    AsyncPipe,
    DrawerModule,
    StyleClass,
    ButtonComponent,
    LinkButtonComponent,
    SidebarContentComponent,
    AsyncPipe,
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  @ViewChild('drawerRef') drawerRef!: Drawer;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  closeCallback(e: any): void {
    this.drawerRef.close(e);
  }

  sideBarDesktopIsOpen$ = new Observable<boolean>();
  sideBarMobileIsOpen$ = new Observable<boolean>();
  readonly sidebarService = inject(SidebarService);
  readonly directionService = inject(DirectionService);
  isRtl$ = new Observable<boolean>();

  ngOnInit() {
    this.listenToSidebarDesktopChanges();
    this.listenToSidebarMobileChanges();
    this.listenToIsRtl();
  }
  private listenToIsRtl() {
    this.isRtl$ = this.directionService.isRtl;
  }
  private listenToSidebarDesktopChanges() {
    this.sideBarDesktopIsOpen$ = this.sidebarService.sideBarDesktopIsOpen;
  }
  private listenToSidebarMobileChanges() {
    this.sideBarMobileIsOpen$ = this.sidebarService.sideBarMobileIsOpen;
  }
}
