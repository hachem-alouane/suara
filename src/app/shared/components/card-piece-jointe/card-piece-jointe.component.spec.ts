import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardPieceJointeComponent } from './card-piece-jointe.component';

describe('CardPieceJointeComponent', () => {
  let component: CardPieceJointeComponent;
  let fixture: ComponentFixture<CardPieceJointeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardPieceJointeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardPieceJointeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
