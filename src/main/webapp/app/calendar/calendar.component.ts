import { Component, OnInit, ViewChild, AfterViewInit, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

import { EventEditionService } from 'app/entities/event-edition/event-edition.service';

import * as moment from 'moment-timezone';

import { FullCalendarComponent } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import timeLinePlugin from '@fullcalendar/timeline';
import listPlugin from '@fullcalendar/list';
import momentTimezonePlugin from '@fullcalendar/moment-timezone';

import esLocale from '@fullcalendar/core/locales/es';
import caLocale from '@fullcalendar/core/locales/ca';
import enLocale from '@fullcalendar/core/locales/en-gb';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export class MyEvent {
  id: number;
  title: string;
  eventName: string;
  sessionName: string;
  textColor: string;
  color: string;
  start: any;
  end: any;
  seriesLogoUrl: string;
  allDay = false;
}

@Component({
  selector: 'jhi-event-dialog',
  templateUrl: 'event-dialog.component.html'
})
export class EventDialogComponent {
  constructor(public dialogRef: MatDialogRef<EventDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: MyEvent) {
    // eslint-disable-next-line no-console
    console.log(data);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit, AfterViewInit {
  @ViewChild('calendar', { static: false }) calendarComponent: FullCalendarComponent;

  calendarPlugins = [dayGridPlugin, timeGridPlugin, timeLinePlugin, listPlugin, momentTimezonePlugin];
  calendarLocales = [esLocale, caLocale, enLocale];

  sessions: any;
  timezone: string;
  timezones: any[];

  constructor(
    private eventEditionService: EventEditionService,
    private translateService: TranslateService,
    private http: HttpClient,
    private eventDialog: MatDialog
  ) {}

  events = (dates, callback) => {
    this.eventEditionService.findCalendarEvents(dates.start, dates.end).subscribe(events => {
      callback(this.convertEvents(events, this.timezone));
    });
  };

  ngOnInit() {
    this.timezone = moment.tz.guess();
    if (this.timezone === undefined) {
      this.timezone = 'Europe/London';
    }
    this.http.get<any[]>('api/timezones').subscribe(res => (this.timezones = res));
  }

  ngAfterViewInit() {
    if (this.translateService.currentLang) {
      this.calendarComponent.getApi().setOption('locale', this.translateService.currentLang);
    } else {
      this.calendarComponent.getApi().setOption('locale', 'es');
    }
    this.translateService.onLangChange.subscribe((langChangeEvent: LangChangeEvent) => {
      this.calendarComponent.getApi().setOption('locale', langChangeEvent.lang);
    });
  }

  openEventDialog = eventInfo => {
    this.eventDialog.open(EventDialogComponent, {
      data: { event: eventInfo }
    });
  };

  private convertEvents(sessions, currentTZ) {
    this.sessions = sessions;
    const result = [];
    for (const session of sessions) {
      const newEvent = new MyEvent();
      newEvent.id = session.id;
      newEvent.title = session.eventName + ' - ' + session.sessionName;
      newEvent.eventName = session.eventName;
      newEvent.sessionName = session.sessionName;
      newEvent.start = moment(session.startTime * 1000)
        .tz(currentTZ)
        .toDate();
      newEvent.end = moment(session.endTime * 1000)
        .tz(currentTZ)
        .toDate();
      newEvent.seriesLogoUrl = session.seriesLogoUrl;
      if (session.sessionType === 2) {
        newEvent.textColor = 'white';
        newEvent.color = 'green';
      } else if (session.sessionType === 1 || session.sessionType === 3) {
        newEvent.textColor = 'white';
        newEvent.color = 'blue';
      } else {
        newEvent.textColor = 'white';
        newEvent.color = 'grey';
      }
      result.push(newEvent);
    }
    return result;
  }
}
