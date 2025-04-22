import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmRecoveryComponent } from './confirm-recovery.component';

describe('ConfirmRecoveryComponent', () => {
  let component: ConfirmRecoveryComponent;
  let fixture: ComponentFixture<ConfirmRecoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmRecoveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmRecoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
