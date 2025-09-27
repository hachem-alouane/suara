import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-link-button',
  standalone: true,
  imports: [RouterLink, ButtonModule, RouterLinkActive],
  templateUrl: './link-button.component.html',
  styleUrl: './link-button.component.scss',
})
export class LinkButtonComponent {
  @Input() routerLink = '/';
  @Input() buttonMode = true;
  @Input() text = false;
  @Input() noUnderline = true;
  @Input() styleClass = '';
  @Input() styleClassRouterLinkActive = '';
  @Output() clickEv = new EventEmitter<Event>();
}
