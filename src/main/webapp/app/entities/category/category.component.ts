import { Component, AfterViewInit, OnDestroy, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { merge, of as observableOf, Subscription } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { JhiEventManager, JhiParseLinks, JhiDataUtils } from 'ng-jhipster';

import { ICategory } from 'app/shared/model/category.model';
import { CategoryService } from './category.service';

import { MatPaginator, MatSort } from '@angular/material';

@Component({
  selector: 'jhi-category',
  templateUrl: './category.component.html'
})
export class CategoryComponent implements AfterViewInit, OnDestroy {
  currentAccount: any;
  categories: ICategory[];
  error: any;
  success: any;
  eventSubscriber: Subscription;
  currentSearch: string;
  routeData: any;
  links: any;
  totalItems: any;
  itemsPerPage: any;
  page: any;
  predicate: any;
  previousPage: any;
  reverse: any;

  displayedColumns: string[] = ['name', 'shortname', 'logo', 'buttons'];

  resultsLength = 0;
  isLoadingResults = true;

  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    protected categoryService: CategoryService,
    protected parseLinks: JhiParseLinks,
    protected activatedRoute: ActivatedRoute,
    protected dataUtils: JhiDataUtils,
    protected router: Router,
    protected eventManager: JhiEventManager
  ) {
    this.routeData = this.activatedRoute.data.subscribe(data => {
      this.page = data.pagingParams.page;
      this.previousPage = data.pagingParams.page;
      this.reverse = data.pagingParams.ascending;
      this.predicate = data.pagingParams.predicate;
    });
    this.currentSearch =
      this.activatedRoute.snapshot && this.activatedRoute.snapshot.queryParams['search']
        ? this.activatedRoute.snapshot.queryParams['search']
        : '';
  }

  ngAfterViewInit() {
    this.registerChangeInCategories();
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page, this.paginator.pageSize)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.loadAll();
        }),
        map((data: HttpResponse<ICategory[]>) => {
          this.isLoadingResults = false;
          return this.processCategoriesResponse(data);
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      )
      .subscribe(data => (this.categories = data));
  }

  private processCategoriesResponse(categories: HttpResponse<ICategory[]>) {
    this.resultsLength = parseInt(categories.headers.get('X-Total-Count'), 10);
    this.links = this.parseLinks.parse(categories.headers.get('link'));
    this.totalItems = parseInt(categories.headers.get('X-Total-Count'), 10);
    return categories.body;
  }

  loadAll() {
    this.categories = [];
    if (this.currentSearch) {
      return this.categoryService.query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      });
    }
    return this.categoryService.query({
      page: this.paginator.pageIndex,
      size: this.paginator.pageSize,
      sort: this.sorting()
    });
  }

  clear() {
    this.categories = [];
    this.paginator.pageIndex = 0;
    this.currentSearch = '';
    this.isLoadingResults = true;
    this.categoryService
      .query({
        page: this.paginator.pageIndex,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<ICategory[]>) => {
        this.isLoadingResults = false;
        this.categories = this.processCategoriesResponse(data);
      });
  }

  search(query) {
    this.categories = [];
    if (!query) {
      return this.clear();
    }
    this.page = 0;
    this.currentSearch = query;
    this.isLoadingResults = true;
    this.categoryService
      .query({
        page: this.paginator.pageIndex,
        query: this.currentSearch,
        size: this.paginator.pageSize,
        sort: this.sorting()
      })
      .subscribe((data: HttpResponse<ICategory[]>) => {
        this.isLoadingResults = false;
        this.categories = this.processCategoriesResponse(data);
      });
  }

  ngOnDestroy() {
    this.eventManager.destroy(this.eventSubscriber);
  }

  trackId(index: number, item: ICategory) {
    return item.id;
  }

  byteSize(field) {
    return this.dataUtils.byteSize(field);
  }

  openFile(contentType, field) {
    return this.dataUtils.openFile(contentType, field);
  }

  registerChangeInCategories() {
    this.eventSubscriber = this.eventManager.subscribe('categoryListModification', () =>
      this.loadAll().subscribe((data: HttpResponse<ICategory[]>) => (this.categories = this.processCategoriesResponse(data)))
    );
  }

  sorting() {
    const result = [this.sort.active + ',' + this.sort.direction];
    if (this.predicate !== 'id') {
      result.push('id');
    }
    return result;
  }
}
