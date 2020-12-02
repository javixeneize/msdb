import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';

import { EventEditionService } from '../event-edition/event-edition.service';
import { IEventSession } from 'app/shared/model/event-session.model';

@Component({
  selector: 'jhi-laps-analysis',
  templateUrl: './laps-analysis.component.html',
  styleUrls: ['lapsAnalysis.scss']
})
export class LapsAnalysisComponent implements OnInit {
  @Input() eventEditionId: number;
  races: IEventSession[];

  constructor(private eventEditionService: EventEditionService) {}

  ngOnInit() {
    this.eventEditionService.findRaces(this.eventEditionId).subscribe(races => (this.races = races));
  }
}
