import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsMailTemplateComponent } from './details-mail-template.component';

describe('DetailsMailTemplateComponent', () => {
  let component: DetailsMailTemplateComponent;
  let fixture: ComponentFixture<DetailsMailTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailsMailTemplateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsMailTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
