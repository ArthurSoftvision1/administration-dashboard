import { Pipe, PipeTransform } from '@angular/core';
import { Shift } from './_models/shift.interface';

@Pipe({
  name: 'calculateTotalClockedIn'
})
export class CalculateTotalClockedInPipe implements PipeTransform {
  transform(shifts: Shift[] | null): number {
    if (!shifts || shifts.length === 0) {
      return 0;
    }
  
    const totalClockedInHours = shifts.reduce((total, shift) => {
      if (shift.clockIn) {
        const clockedInHours = shift.clockIn / (60 * 60 * 1000);
        return total + clockedInHours;
      }
      return total;
    }, 0);
  
    return Math.round(totalClockedInHours);
  }
}
