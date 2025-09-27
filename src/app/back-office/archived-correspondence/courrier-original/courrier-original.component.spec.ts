import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourrierOriginalComponent } from './courrier-original.component';

describe('CourrierOriginalComponent', () => {
  let component: CourrierOriginalComponent;
  let fixture: ComponentFixture<CourrierOriginalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourrierOriginalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourrierOriginalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
