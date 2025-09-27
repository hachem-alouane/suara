import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OutgoingCorrespondenceComponent } from './outgoing-correspondence.component';

describe('OutgoingCorrespondenceComponent', () => {
  let component: OutgoingCorrespondenceComponent;
  let fixture: ComponentFixture<OutgoingCorrespondenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OutgoingCorrespondenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OutgoingCorrespondenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
