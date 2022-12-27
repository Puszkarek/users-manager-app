import { OverlayModule } from '@angular/cdk/overlay';
import { TestBed } from '@angular/core/testing';

import { ModalReference } from './modal-reference.service';

describe(ModalReference.name, () => {
  let service: ModalReference;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
    });
    service = TestBed.inject(ModalReference);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
