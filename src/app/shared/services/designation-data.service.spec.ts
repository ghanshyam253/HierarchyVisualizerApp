import { TestBed } from '@angular/core/testing';

import { DesignationDataService } from './designation-data.service';

describe('DesignationDataService', () => {
  let service: DesignationDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DesignationDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
