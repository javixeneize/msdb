import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Response } from '@angular/http';

import { NgbActiveModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { EventManager, AlertService, JhiLanguageService, DataUtils } from 'ng-jhipster';

import { Engine } from './engine.model';
import { EnginePopupService } from './engine-popup.service';
import { EngineService } from './engine.service';
@Component({
    selector: 'jhi-engine-dialog',
    templateUrl: './engine-dialog.component.html'
})
export class EngineDialogComponent implements OnInit {

    engine: Engine;
    authorities: any[];
    isSaving: boolean;

    engines: Engine[];
    constructor(
        public activeModal: NgbActiveModal,
        private jhiLanguageService: JhiLanguageService,
        private dataUtils: DataUtils,
        private alertService: AlertService,
        private engineService: EngineService,
        private eventManager: EventManager
    ) {
        this.jhiLanguageService.setLocations(['engine']);
    }

    ngOnInit() {
        this.isSaving = false;
        this.authorities = ['ROLE_USER', 'ROLE_ADMIN'];
        this.engineService.query().subscribe(
            (res: Response) => { this.engines = res.json(); }, (res: Response) => this.onError(res.json()));
    }
    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }

    setFileData($event, engine, field, isImage) {
        if ($event.target.files && $event.target.files[0]) {
            let $file = $event.target.files[0];
            if (isImage && !/^image\//.test($file.type)) {
                return;
            }
            this.dataUtils.toBase64($file, (base64Data) => {
                engine[field] = base64Data;
                engine[`${field}ContentType`] = $file.type;
            });
        }
    }
    clear () {
        this.activeModal.dismiss('cancel');
    }

    save () {
        this.isSaving = true;
        if (this.engine.id !== undefined) {
            this.engineService.update(this.engine)
                .subscribe((res: Engine) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        } else {
            this.engineService.create(this.engine)
                .subscribe((res: Engine) => this.onSaveSuccess(res), (res: Response) => this.onSaveError(res.json()));
        }
    }

    private onSaveSuccess (result: Engine) {
        this.eventManager.broadcast({ name: 'engineListModification', content: 'OK'});
        this.isSaving = false;
        this.activeModal.dismiss(result);
    }

    private onSaveError (error) {
        this.isSaving = false;
        this.onError(error);
    }

    private onError (error) {
        this.alertService.error(error.message, null, null);
    }

    trackEngineById(index: number, item: Engine) {
        return item.id;
    }
}

@Component({
    selector: 'jhi-engine-popup',
    template: ''
})
export class EnginePopupComponent implements OnInit, OnDestroy {

    modalRef: NgbModalRef;
    routeSub: any;

    constructor (
        private route: ActivatedRoute,
        private enginePopupService: EnginePopupService
    ) {}

    ngOnInit() {
        this.routeSub = this.route.params.subscribe(params => {
            if ( params['id'] ) {
                this.modalRef = this.enginePopupService
                    .open(EngineDialogComponent, params['id']);
            } else {
                this.modalRef = this.enginePopupService
                    .open(EngineDialogComponent);
            }

        });
    }

    ngOnDestroy() {
        this.routeSub.unsubscribe();
    }
}
