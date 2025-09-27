import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPieceJointeUploadComponent } from './card-piece-jointe-upload.component';

describe('CardPieceJointeUploadComponent', () => {
  let component: CardPieceJointeUploadComponent;
  let fixture: ComponentFixture<CardPieceJointeUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPieceJointeUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPieceJointeUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
