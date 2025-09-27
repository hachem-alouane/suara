import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { INotification } from '../../../core/models/notification.interface';
import { DynamicDatePipe } from '../../pipes/dynamic-date.pipe';
import { LinkButtonComponent } from '../../ui/link-button/link-button.component';

@Component({
  selector: 'app-item-notification',
  standalone: true,
  imports: [DynamicDatePipe, LinkButtonComponent],
  templateUrl: './item-notification.component.html',
  styleUrl: './item-notification.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemNotificationComponent {
  @Input({ required: true }) notification: INotification | null = null;
  @Output() notificationClick = new EventEmitter<boolean>();
}
