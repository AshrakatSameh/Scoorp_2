import { TestBed } from '@angular/core/testing';

import { WarehouseCatService } from './warehouse-cat.service';

describe('WarehouseCatService', () => {
  let service: WarehouseCatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseCatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
