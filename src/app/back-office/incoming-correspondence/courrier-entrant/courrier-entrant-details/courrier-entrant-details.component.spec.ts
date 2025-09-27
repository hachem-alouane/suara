import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourrierEntrantDetailsComponent } from './courrier-entrant-details.component';

describe('CourrierEntrantDetailsComponent', () => {
  let component: CourrierEntrantDetailsComponent;
  let fixture: ComponentFixture<CourrierEntrantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourrierEntrantDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourrierEntrantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
