import { NgModule } from '@angular/core';

import { MotorsportsDatabaseStandingsModule } from '../standings/standings.module';
import { MotorsportsDatabaseSharedModule } from 'app/shared/shared.module';
import { SeriesEditionComponent } from './series-edition.component';
import { SeriesEditionDetailComponent } from './series-edition-detail.component';
import { SeriesEditionCalendarDialogComponent } from './series-edition-calendar-dialog.component';
import { SeriesEditionRoutingModule } from './series-edition.route';

@NgModule({
  imports: [MotorsportsDatabaseStandingsModule, MotorsportsDatabaseSharedModule, SeriesEditionRoutingModule],
  declarations: [SeriesEditionComponent, SeriesEditionDetailComponent, SeriesEditionCalendarDialogComponent],
  exports: [SeriesEditionComponent],
  entryComponents: [SeriesEditionCalendarDialogComponent]
})
export class MotorsportsDatabaseSeriesEditionModule {}
