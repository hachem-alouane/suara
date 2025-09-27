import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardPieComponent } from './dashboard-pie.component';

describe('DashboardPieComponent', () => {
  let component: DashboardPieComponent;
  let fixture: ComponentFixture<DashboardPieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardPieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardPieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
