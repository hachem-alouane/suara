import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ButtonComponent } from '../../ui/button/button.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-return-back-button',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './return-back-button.component.html',
  styleUrl: './return-back-button.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReturnBackButtonComponent {
  private readonly location = inject(Location);

  goBack() {
    this.location.back();
  }
}
