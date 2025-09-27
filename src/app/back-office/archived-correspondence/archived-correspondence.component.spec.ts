import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedCorrespondenceComponent } from './archived-correspondence.component';

describe('ArchivedCorrespondenceComponent', () => {
  let component: ArchivedCorrespondenceComponent;
  let fixture: ComponentFixture<ArchivedCorrespondenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedCorrespondenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArchivedCorrespondenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
