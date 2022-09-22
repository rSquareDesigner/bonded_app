import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountsManagerComponent } from './accounts-manager.component';

describe('AccountsManagerComponent', () => {
  let component: AccountsManagerComponent;
  let fixture: ComponentFixture<AccountsManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccountsManagerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AccountsManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
