import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFeedbackComponent } from './transaction-feedback.component';

describe('TransactionFeedbackComponent', () => {
  let component: TransactionFeedbackComponent;
  let fixture: ComponentFixture<TransactionFeedbackComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionFeedbackComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionFeedbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
