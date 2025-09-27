import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [ButtonModule, RippleModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
})
export class ButtonComponent {
  @Input() size: 'small' | 'large' = 'large';
  @Input() text = false;
  @Input() isDisabled = false;
  @Input() type: 'submit' | 'reset' | 'menu' | 'button' = 'button';
  @Input() severity:
    | 'success'
    | 'info'
    | 'warn'
    | 'danger'
    | 'help'
    | 'primary'
    | 'secondary'
    | 'contrast'
    | null
    | undefined = null;
  @Input() styleClass = '';
  @Input() outlined = false;
  @Input() rounded = false;
  @Input() raised = false;
  @Input() loading = false;
  @Output() clickEv = new EventEmitter<Event>();
}
