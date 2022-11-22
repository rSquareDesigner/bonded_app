import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BidsAndOffersComponent } from './bids-and-offers.component';

describe('BidsAndOffersComponent', () => {
  let component: BidsAndOffersComponent;
  let fixture: ComponentFixture<BidsAndOffersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BidsAndOffersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BidsAndOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
