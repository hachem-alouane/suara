import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptedMailListComponent } from './accepted-mail-list.component';

describe('AcceptedMailListComponent', () => {
  let component: AcceptedMailListComponent;
  let fixture: ComponentFixture<AcceptedMailListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AcceptedMailListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcceptedMailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
