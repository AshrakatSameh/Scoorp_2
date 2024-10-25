import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CateogriesComponent } from './cateogries.component';

describe('CateogriesComponent', () => {
  let component: CateogriesComponent;
  let fixture: ComponentFixture<CateogriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CateogriesComponent]
    });
    fixture = TestBed.createComponent(CateogriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
