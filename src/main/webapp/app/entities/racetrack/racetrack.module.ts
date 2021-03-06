import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { RacetrackComponent } from './racetrack.component';
import { RacetrackDetailComponent } from './racetrack-detail.component';
import { RacetrackUpdateComponent } from './racetrack-update.component';
import { RacetrackDeletePopupComponent, RacetrackDeleteDialogComponent } from './racetrack-delete-dialog.component';
import { racetrackRoute, racetrackPopupRoute } from './racetrack.route';

const ENTITY_STATES = [...racetrackRoute, ...racetrackPopupRoute];

@NgModule({
  imports: [MotorsportsDatabaseSharedModule, RouterModule.forChild(ENTITY_STATES)],
  declarations: [
    RacetrackComponent,
    RacetrackDetailComponent,
    RacetrackUpdateComponent,
    RacetrackDeleteDialogComponent,
    RacetrackDeletePopupComponent
  ],
  entryComponents: [RacetrackDeleteDialogComponent]
})
export class MotorsportsDatabaseRacetrackModule {}
