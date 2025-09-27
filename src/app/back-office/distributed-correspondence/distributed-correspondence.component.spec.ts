import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DistributedCorrespondenceComponent } from './distributed-correspondence.component';

describe('DistributedCorrespondenceComponent', () => {
  let component: DistributedCorrespondenceComponent;
  let fixture: ComponentFixture<DistributedCorrespondenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DistributedCorrespondenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DistributedCorrespondenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
