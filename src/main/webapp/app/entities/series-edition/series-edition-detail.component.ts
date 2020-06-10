import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SeriesEditionService } from './series-edition.service';
import { ISeriesEdition } from 'app/shared/model/series-edition.model';
import { SeriesEditionCalendarDialogComponent } from './series-edition-calendar-dialog.component';

import { ImagesService } from 'app/shared/services/images.service';

import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'jhi-series-edition-detail',
  templateUrl: './series-edition-detail.component.html',
  styleUrls: ['series-edition.scss']
})
export class SeriesEditionDetailComponent implements OnInit {
  seriesEdition: ISeriesEdition;
  isActive = false;
  genericPosterUrl: string;

  displayedColumns: string[] = ['date', 'name', 'poster', 'winners', 'buttons'];

  driversStandings: any;
  teamsStandings: any;
  manufacturersStandings: any;
  driversChampions: any[];
  teamsChampions: any[];
  numEvents = 0;
  eventsProcessed = 0;
  displayEvents = false;
  colsChampsDriver = 'col-md-3';
  colsChampsTeam = 'col-md-3';

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected seriesEditionService: SeriesEditionService,
    protected imagesService: ImagesService,
    private dialog: MatDialog
  ) {
    this.genericPosterUrl = imagesService.getGenericRacePoster();
  }

  ngOnInit() {
    this.activatedRoute.data.subscribe(({ seriesEdition }) => {
      this.seriesEdition = seriesEdition;
      this.loadSeriesEvents();
    });
  }

  loadSeriesEvents() {
    this.seriesEditionService.findEvents(this.seriesEdition.id).subscribe(events => {
      this.seriesEdition.events = events.body;
      if (events.body.filter(event => event.status !== 'ONGOING').length > 0) {
        this.displayedColumns.unshift('status');
      }
    });
  }

  previousState() {
    window.history.back();
  }

  public getPosterUrl(posterUrl: string): string {
    if (posterUrl) return posterUrl;

    return this.genericPosterUrl;
  }

  public getFaceUrl(faceUrl: string, numDrivers: number, thumbSize: number): string {
    return this.imagesService.getFaceUrl(faceUrl, thumbSize, thumbSize);
  }

  public concatDriverNames(drivers: any[]): string {
    return drivers.map(d => d.driverName).join(', ');
  }

  addEventToCalendar() {
    const dialogRef = this.dialog.open(SeriesEditionCalendarDialogComponent, {
      data: {
        seriesEdition: this.seriesEdition
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadSeriesEvents();
      }
    });
  }

  editEventAssignment(event) {
    const dialogRef = this.dialog.open(SeriesEditionCalendarDialogComponent, {
      data: {
        seriesEdition: this.seriesEdition,
        eventEdition: event
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.loadSeriesEvents();
      }
    });
  }
}
