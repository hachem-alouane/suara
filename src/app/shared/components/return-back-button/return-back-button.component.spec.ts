import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnBackButtonComponent } from './return-back-button.component';

describe('ReturnBackButtonComponent', () => {
  let component: ReturnBackButtonComponent;
  let fixture: ComponentFixture<ReturnBackButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnBackButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnBackButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
