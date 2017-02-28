import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, JhiLanguageService } from 'ng-jhipster';

import { Event } from './event.model';
import { EventPopupService } from './event-popup.service';
import { EventService } from './event.service';

@Component({
    selector: 'jhi-event-delete-dialog',
    templateUrl: './event-delete-dialog.component.html'
})
export class EventDeleteDialogComponent {

    event: Event;

    constructor(
        private jhiLanguageService: JhiLanguageService,
        private eventService: EventService,
        public activeModal: NgbActiveModal,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['event']);
    }

    clear () {
        this.activeModal.dismiss('cancel');
    }

    confirmDelete (id: number) {
        this.eventService.delete(id).subscribe(response => {
            this.eventManager.broadcast({
                name: 'eventListModification',
                content: 'Deleted an event'
            });
            this.activeModal.dismiss(true);
        });
    }
}

@Component({
    selector: 'jhi-event-delete-popup',
    template: ''
})
export class EventDeletePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private eventPopupService: EventPopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            this.modalRef = this.eventPopupService
                .open(EventDeleteDialogComponent, params['id']);
        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
