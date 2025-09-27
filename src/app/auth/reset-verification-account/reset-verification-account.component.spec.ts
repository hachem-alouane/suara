import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetVerificationAccountComponent } from './reset-verification-account.component';

describe('ResetVerificationAccountComponent', () => {
  let component: ResetVerificationAccountComponent;
  let fixture: ComponentFixture<ResetVerificationAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetVerificationAccountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetVerificationAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
