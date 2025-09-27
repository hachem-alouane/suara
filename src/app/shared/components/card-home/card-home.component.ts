import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SvgIconComponent } from 'angular-svg-icon';
import { ICardHome } from '../../../core/models/card-home.interface';
import { LinkButtonComponent } from '../../ui/link-button/link-button.component';

@Component({
  selector: 'app-card-home',
  standalone: true,
  imports: [SvgIconComponent, LinkButtonComponent],
  templateUrl: './card-home.component.html',
  styleUrl: './card-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardHomeComponent {
  @Input({ required: true }) cardHome!: ICardHome;
}
