export interface IDriversName {
  driversNames?: string;
  raceNumber?: string;
}

export class DriversNames {
  constructor(public driversNames?: string, public raceNumber?: string) {}
}
