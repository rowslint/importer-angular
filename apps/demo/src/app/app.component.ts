import { Component } from '@angular/core';
import { take } from 'rxjs';

import { RowslintService, RowslintTemplateConfig } from '@rowslint/importer-angular';

@Component({
  selector: 'demo-root',
  template: ` <button (click)="launch()">Launch</button> `,
})
export class AppComponent {
  config: RowslintTemplateConfig = {
    templateKey: '',
  };

  constructor(private rowslintService: RowslintService) {}

  launch() {
    this.rowslintService.launch(this.config);
    this.rowslintService.onImport.pipe(take(1)).subscribe((result) => {
      // Continue the import process.
    });
  }
}
