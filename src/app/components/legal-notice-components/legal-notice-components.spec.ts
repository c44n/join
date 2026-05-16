import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalNoticeComponents } from './legal-notice-components';

describe('LegalNoticeComponents', () => {
  let component: LegalNoticeComponents;
  let fixture: ComponentFixture<LegalNoticeComponents>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LegalNoticeComponents],
    }).compileComponents();

    fixture = TestBed.createComponent(LegalNoticeComponents);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
