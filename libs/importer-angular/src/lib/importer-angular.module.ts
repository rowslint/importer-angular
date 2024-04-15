import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA, ModuleWithProviders } from '@angular/core';
import { LazyElementModuleOptions, LazyElementsModule } from '@angular-extensions/elements';

import { RowslintComponent } from './components/importer/importer.component';
import { RowslintOptions } from './models';
import { ROWSLINT_OPTIONS } from './configs';

const lazyElementsOptions: LazyElementModuleOptions = {
  elementConfigs: [
    {
      tag: 'rowslint-element',
      url: 'https://cdn.jsdelivr.net/npm/@rowslint/importer@latest/browser/rowslint-element.js',
      preload: true,
    },
  ],
};

@NgModule({
  declarations: [RowslintComponent],
  imports: [CommonModule, LazyElementsModule.forRoot(lazyElementsOptions)],
  exports: [RowslintComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class RowslintModule {
  static forRoot(options: RowslintOptions): ModuleWithProviders<RowslintModule> {
    return {
      ngModule: RowslintModule,
      providers: [
        {
          provide: ROWSLINT_OPTIONS,
          useValue: options,
        },
      ],
    };
  }
}
