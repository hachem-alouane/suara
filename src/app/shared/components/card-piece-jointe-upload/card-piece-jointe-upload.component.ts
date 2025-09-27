import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IPieceJointe } from '../../../core/models/piece-jointe.interface';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-card-piece-jointe-upload',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './card-piece-jointe-upload.component.html',
  styleUrl: './card-piece-jointe-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardPieceJointeUploadComponent {
  @Input({ required: true }) file!: IPieceJointe;
  @Input({ required: true }) index = 0;
  @Output() deleteEvent = new EventEmitter<{ index: number }>();
  @Output() viewFileEvent = new EventEmitter<{ file: File }>();
}
