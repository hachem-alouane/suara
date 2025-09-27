import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteMessageAdminComponent } from './write-message-admin.component';

describe('WriteMessageAdminComponent', () => {
  let component: WriteMessageAdminComponent;
  let fixture: ComponentFixture<WriteMessageAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WriteMessageAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WriteMessageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
