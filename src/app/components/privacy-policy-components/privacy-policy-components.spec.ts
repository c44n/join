import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyPolicyComponents } from './privacy-policy-components';

describe('PrivacyPolicyComponents', () => {
  let component: PrivacyPolicyComponents;
  let fixture: ComponentFixture<PrivacyPolicyComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrivacyPolicyComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(PrivacyPolicyComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
