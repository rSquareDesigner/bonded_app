import { TestBed } from '@angular/core/testing';

import { VerificationsService } from './verifications.service';

describe('VerificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VerificationsService = TestBed.get(VerificationsService);
    expect(service).toBeTruthy();
  });
});
