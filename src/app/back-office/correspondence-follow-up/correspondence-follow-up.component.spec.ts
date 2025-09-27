import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrespondenceFollowUpComponent } from './correspondence-follow-up.component';

describe('CorrespondenceFollowUpComponent', () => {
  let component: CorrespondenceFollowUpComponent;
  let fixture: ComponentFixture<CorrespondenceFollowUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrespondenceFollowUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrespondenceFollowUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
