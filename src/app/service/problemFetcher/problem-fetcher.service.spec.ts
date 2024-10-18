import { TestBed } from '@angular/core/testing';

import { ProblemFetcherService } from './problem-fetcher.service';

describe('ProblemFetcherService', () => {
  let service: ProblemFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProblemFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
