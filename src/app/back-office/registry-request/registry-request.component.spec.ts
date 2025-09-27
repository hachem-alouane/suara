import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistryRequestComponent } from './registry-request.component';

describe('RegistryRequestComponent', () => {
  let component: RegistryRequestComponent;
  let fixture: ComponentFixture<RegistryRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistryRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistryRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
