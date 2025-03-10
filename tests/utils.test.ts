import { expect, test } from 'vitest'
import { closestStartDate } from '../utils/utils';
import { startDate, nowSem } from '../utils/constants';

test('Closest start date should choose the earliest day within the given weekdays', () => {
  expect(closestStartDate(['MO', 'FR'])).toBe(startDate[nowSem]['FR']);
  expect(closestStartDate(['MO', 'TH'])).toBe(startDate[nowSem]['TH']);
})
