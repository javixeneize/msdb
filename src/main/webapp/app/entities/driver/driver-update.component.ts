import { Component, OnInit, ElementRef } from '@angular/core';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap, debounceTime, map } from 'rxjs/operators';
import { JhiAlertService, JhiDataUtils } from 'ng-jhipster';
import { IDriver, Driver } from 'app/shared/model/driver.model';
import { DriverService } from './driver.service';
import { ICountry } from 'app/shared/country/country.model';
import { CountryService } from 'app/shared/country/country.service';

@Component({
  selector: 'jhi-driver-update',
  templateUrl: './driver-update.component.html'
})
export class DriverUpdateComponent implements OnInit {
  isSaving: boolean;
  birthDateDp: any;
  deathDateDp: any;

  options: Observable<ICountry[]>;

  editForm = this.fb.group({
    id: [],
    name: [null, [Validators.required, Validators.maxLength(40)]],
    surname: [null, [Validators.required, Validators.maxLength(60)]],
    birthDate: [],
    birthPlace: [null, [Validators.maxLength(75)]],
    deathDate: [],
    deathPlace: [null, [Validators.maxLength(75)]],
    portrait: [],
    portraitContentType: [],
    portraitUrl: [],
    nationality: []
  });

  constructor(
    protected dataUtils: JhiDataUtils,
    protected jhiAlertService: JhiAlertService,
    protected driverService: DriverService,
    protected countryService: CountryService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.displayFn = this.displayFn.bind(this);
    this.isSaving = false;

    this.options = this.editForm.get('nationality').valueChanges.pipe(
      debounceTime(300),
      switchMap(value => this.countryService.searchCountries(value)),
      map(response => response.body)
    );

    this.activatedRoute.data.subscribe(({ driver }) => {
      this.updateForm(driver);
    });
  }

  displayFn(country?: ICountry): string | undefined {
    return country ? country.countryName : undefined;
  }

  updateForm(driver: IDriver) {
    this.editForm.patchValue({
      id: driver.id,
      name: driver.name,
      surname: driver.surname,
      birthDate: driver.birthDate,
      birthPlace: driver.birthPlace,
      deathDate: driver.deathDate,
      deathPlace: driver.deathPlace,
      portrait: driver.portrait,
      portraitContentType: driver.portraitContentType,
      portraitUrl: driver.portraitUrl,
      nationality: driver.nationality
    });
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  setFileData(event, field: string, isImage) {
    return new Promise((resolve, reject) => {
      if (event && event.target && event.target.files && event.target.files[0]) {
        const file: File = event.target.files[0];
        if (isImage && !file.type.startsWith('image/')) {
          reject(`File was expected to be an image but was found to be ${file.type}`);
        } else {
          const filedContentType: string = field + 'ContentType';
          this.dataUtils.toBase64(file, base64Data => {
            this.editForm.patchValue({
              [field]: base64Data,
              [filedContentType]: file.type
            });
          });
        }
      } else {
        reject(`Base64 data was not set as file could not be extracted from passed parameter: ${event}`);
      }
    }).then(
      // eslint-disable-next-line no-console
      () => {}, // success
      this.onError
    );
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string) {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null
    });
    if (this.elementRef && idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState() {
    window.history.back();
  }

  save() {
    this.isSaving = true;
    const driver = this.createFromForm();
    if (driver.id !== undefined) {
      this.subscribeToSaveResponse(this.driverService.update(driver));
    } else {
      this.subscribeToSaveResponse(this.driverService.create(driver));
    }
  }

  private createFromForm(): IDriver {
    return {
      ...new Driver(),
      id: this.editForm.get(['id']).value,
      name: this.editForm.get(['name']).value,
      surname: this.editForm.get(['surname']).value,
      birthDate: this.editForm.get(['birthDate']).value,
      birthPlace: this.editForm.get(['birthPlace']).value,
      deathDate: this.editForm.get(['deathDate']).value,
      deathPlace: this.editForm.get(['deathPlace']).value,
      portraitContentType: this.editForm.get(['portraitContentType']).value,
      portrait: this.editForm.get(['portrait']).value,
      portraitUrl: this.editForm.get(['portraitUrl']).value,
      nationality: this.editForm.get(['nationality']).value
    };
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDriver>>) {
    result.subscribe(() => this.onSaveSuccess(), () => this.onSaveError());
  }

  protected onSaveSuccess() {
    this.isSaving = false;
    this.previousState();
  }

  protected onSaveError() {
    this.isSaving = false;
  }
  protected onError(errorMessage: string) {
    this.jhiAlertService.error(errorMessage, null, null);
  }
}
