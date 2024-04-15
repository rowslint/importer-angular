import { DOCUMENT } from '@angular/common';
import { ApplicationRef, ComponentFactoryResolver, ComponentRef, Inject, Injectable, Injector } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { RowslintTemplateConfig, RowslintImportResult, RowslintOptions } from './../models';
import { RowslintComponent } from './../components/importer/importer.component';

@Injectable({ providedIn: 'root' })
export class RowslintService {
  #onDestroy$?: Subject<void>;
  #currentCompRef?: ComponentRef<RowslintComponent>;
  onImport = new Subject<RowslintImportResult>();

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private applicationRef: ApplicationRef
  ) {}

  isProvided(apiKey: RowslintOptions['apiKey']) {
    if (apiKey) {
      return true;
    } else {
      throw new Error(
        'No API key provided to Rowslint. You may have forgotten to provide the RowslintModule with a valid API key to finish initializing Rowslint.'
      );
    }
  }

  launch(rowslintConfig: RowslintTemplateConfig, file?: File) {
    this.#currentCompRef = this.componentFactoryResolver
      .resolveComponentFactory(RowslintComponent)
      .create(this.injector);
    this.#currentCompRef.instance.config = rowslintConfig;
    this.#currentCompRef.instance.showButton = false;
    this.#currentCompRef.instance.file = file || null;

    this.#onDestroy$ = new Subject();
    this.#currentCompRef.instance.import
      .pipe(takeUntil(this.#onDestroy$))
      .subscribe((payload) => this.onImport.next(payload));

    this.document.body.appendChild(this.#currentCompRef.location.nativeElement);
    this.applicationRef.attachView(this.#currentCompRef.hostView);
  }

  remove() {
    if (this.#currentCompRef) {
      this.applicationRef.detachView(this.#currentCompRef.hostView);
      this.#currentCompRef.destroy();

      this.#onDestroy$?.next();
      this.#onDestroy$?.unsubscribe();
    }
  }
}
