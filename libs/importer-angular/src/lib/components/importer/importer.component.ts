import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';

import { RowslintTemplateConfig, RowslintImportResult, RowslintOptions } from './../../models';
import { RowslintService } from './../../services/importer.service';
import { ROWSLINT_OPTIONS } from './../../configs';

@Component({
  selector: 'rowslint-angular',
  templateUrl: './importer.component.html',
})
export class RowslintComponent implements OnInit {
  @Input() config!: RowslintTemplateConfig;
  @Input() showButton = false;
  @Output() import = new EventEmitter<RowslintImportResult>();
  isProvided = false;
  file?: File | null;
  options!: RowslintOptions;

  constructor(
    @Inject(ROWSLINT_OPTIONS) private readonly rowslintOptions: RowslintOptions,
    private rowslintService: RowslintService
  ) {}

  ngOnInit() {
    this.options = this.rowslintOptions;
    this.isProvided = this.rowslintService.isProvided(this.rowslintOptions.apiKey);
  }

  onImport(event: Event) {
    const customEvent = event as CustomEvent<RowslintImportResult>;
    this.import.emit(customEvent.detail);

    this.rowslintService.remove();
  }
}
