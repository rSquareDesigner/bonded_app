import { TestBed } from '@angular/core/testing';

import { MyblobService } from './myblob.service';

describe('MyblobService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyblobService = TestBed.get(MyblobService);
    expect(service).toBeTruthy();
  });
});
