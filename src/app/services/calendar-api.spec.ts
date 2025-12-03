import { TestBed } from '@angular/core/testing';

import { CalendarApi } from './calendar-api';

describe('CalendarApi', () => {
  let service: CalendarApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalendarApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
