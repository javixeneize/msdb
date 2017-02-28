import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MotorsportsDatabaseSharedModule } from '../../shared';

import {
    TyreProviderService,
    TyreProviderPopupService,
    TyreProviderComponent,
    TyreProviderDetailComponent,
    TyreProviderDialogComponent,
    TyreProviderPopupComponent,
    TyreProviderDeletePopupComponent,
    TyreProviderDeleteDialogComponent,
    tyreProviderRoute,
    tyreProviderPopupRoute,
} from './';

let ENTITY_STATES = [
    ...tyreProviderRoute,
    ...tyreProviderPopupRoute,
];

@NgModule({
    imports: [
        MotorsportsDatabaseSharedModule,
        RouterModule.forRoot(ENTITY_STATES, { useHash: true })
    ],
    declarations: [
        TyreProviderComponent,
        TyreProviderDetailComponent,
        TyreProviderDialogComponent,
        TyreProviderDeleteDialogComponent,
        TyreProviderPopupComponent,
        TyreProviderDeletePopupComponent,
    ],
    entryComponents: [
        TyreProviderComponent,
        TyreProviderDialogComponent,
        TyreProviderPopupComponent,
        TyreProviderDeleteDialogComponent,
        TyreProviderDeletePopupComponent,
    ],
    providers: [
        TyreProviderService,
        TyreProviderPopupService,
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class MotorsportsDatabaseTyreProviderModule {}
