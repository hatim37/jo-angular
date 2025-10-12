import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailProductOrderComponent } from './detail-product-order.component';

describe('DetailProductOrderComponent', () => {
  let component: DetailProductOrderComponent;
  let fixture: ComponentFixture<DetailProductOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailProductOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailProductOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
