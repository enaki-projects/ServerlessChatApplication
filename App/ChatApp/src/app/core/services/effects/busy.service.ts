import {Injectable} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';

const spineTypes = [
  "ball-atom",
  "ball-circus",
  "ball-beat",
  "ball-scale-multiple",
]

@Injectable({
  providedIn: 'root'
})
export class BusyService {
  busyRequestCount = 0;

  constructor(private spinnerService: NgxSpinnerService) { }

  busy(name = undefined): void {
    const randomType = spineTypes[Math.floor(Math.random() * spineTypes.length)];

    this.busyRequestCount++;
    this.spinnerService.show(name, {
      type: randomType,
      bdColor: 'rgba(160,146,146,0.3)',
      color: '#000000'
    });
  }

  idle(name = undefined): void {
    this.busyRequestCount--;
    if (this.busyRequestCount <= 0) {
      this.busyRequestCount = 0;
      this.spinnerService.hide(name);
    }
  }
}
