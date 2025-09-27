import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutBackOfficeComponent } from './layout-back-office.component';

describe('LayoutBackOfficeComponent', () => {
  let component: LayoutBackOfficeComponent;
  let fixture: ComponentFixture<LayoutBackOfficeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LayoutBackOfficeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayoutBackOfficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
