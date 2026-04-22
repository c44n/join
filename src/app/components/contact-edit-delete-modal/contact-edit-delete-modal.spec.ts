import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactEditDeleteModal } from './contact-edit-delete-modal';

describe('ContactEditDeleteModal', () => {
  let component: ContactEditDeleteModal;
  let fixture: ComponentFixture<ContactEditDeleteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactEditDeleteModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactEditDeleteModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
