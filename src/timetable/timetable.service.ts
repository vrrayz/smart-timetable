import { Injectable } from '@nestjs/common';

@Injectable()
export class TimetableService {
  private MILLISECONDS = 1000;
  private AN_HOUR_IN_MILLISECONDS = 3600 * this.MILLISECONDS;
  private A_MINUTE_IN_MILLISECONDS = 60 * this.MILLISECONDS;

  toDigitalClock(timeInMilliseconds: number) {
    // Digital Clock conversion logic
    const hour = Math.floor(
      timeInMilliseconds / this.AN_HOUR_IN_MILLISECONDS,
    ).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    });
    const minute = Math.floor(
      (timeInMilliseconds % this.AN_HOUR_IN_MILLISECONDS) /
        this.A_MINUTE_IN_MILLISECONDS,
    ).toLocaleString('en-US', {
      minimumIntegerDigits: 2,
    });
    const time = `${hour}:${minute}`;
    return time;
  }
}
