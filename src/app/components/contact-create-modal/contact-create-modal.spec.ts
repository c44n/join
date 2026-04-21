import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCreateModal } from './contact-create-modal';

describe('ContactCreateModal', () => {
  let component: ContactCreateModal;
  let fixture: ComponentFixture<ContactCreateModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactCreateModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactCreateModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
