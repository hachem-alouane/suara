import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardedMailComponent } from './forwarded-mail.component';

describe('ForwardedMailComponent', () => {
  let component: ForwardedMailComponent;
  let fixture: ComponentFixture<ForwardedMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForwardedMailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwardedMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
