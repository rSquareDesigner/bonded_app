import { TestBed } from '@angular/core/testing';

import { KrakenService } from './kraken.service';

describe('KrakenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: KrakenService = TestBed.get(KrakenService);
    expect(service).toBeTruthy();
  });
});
