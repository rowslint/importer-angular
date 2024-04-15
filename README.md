# @rowslint/importer-angular

The Rowslint Angular package provides access to the prebuilt importer component. The package interacts directly with the Rowslint APIs using your API key.

## Installation

```
npm install @rowslint/importer-angular
```

## Usage

### Module

Retrieve the API key from the organization page and import `RowslintModule` with the organization API key in your module

```ts
import { RowslintModule } from '@rowslint/importer-angular';

@NgModule({
  imports: [RowslintModule.forRoot({ apiKey: 'ORGANIZATION_API_KEY' })]
})
```

### Component

Call the `launch()` method of the `RowslintService` service with the template config to display the importer UI.

```ts
import { Component } from '@angular/core';
import { RowslintTemplateConfig, RowslintService } from '@rowslint/importer-angular';

@Component({
  selector: 'app-root',
  template: `<button (click)="import()">Import</button>`,
})
export class AppComponent {
  config: RowslintTemplateConfig = {
    // Your template key here.
    templateKey: 'TEMPLATE_KEY',
  };

  constructor(private rowslintService: RowslintService) {}

  import() {
    this.rowslintService.launch(this.config);
  }
}
```

#### Headless UI

You can also use your custom upload UI and then use Rowslint importer only to format and validate data. To do so, call the `launch()` method with the uploaded file (in `file` type).

```ts
this.rowslintService.launch(this.config, this.file);
```

### Events

RowslintService provides an event to listen to the closing of the importer modal. You can use it to handle the closing of the importer after the import has been completed.

```
constructor(private rowslintService: RowslintService) {
  this.rowslintService.onImport.subscribe((result) => {
    switch (result.status) {
      case RowslintImportStatus.SUCCESS:
        // Handle spreadsheet import success.
        break;
      case RowslintImportStatus.ERROR:
        // Handle spreadsheet import error.
        break;
      case RowslintImportStatus.CANCELLED:
        ¨// Handle spreadsheet import cancel.
        break;
      }
    });
  }
```

## Interfaces

### `RowslintOptions`

#### Description

Represents the global options. Used to configure RowslintModule at the top level of the application.

#### Properties

| name   | type     | required | default | description                                                      |
| ------ | -------- | -------- | ------- | ---------------------------------------------------------------- |
| apiKey | `string` | required |         | The organization API key. Can be found in the organization page. |

### `RowslintTemplateConfig`

#### Description

Represents the configuration of each template importer.

#### Properties

| name             | type                              | required | default | description                                                                                                                                                                                            |
| ---------------- | --------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| templateKey      | `string`                          | required |         | The template key. Can be found in the template detail/edit page.                                                                                                                                       |
| language         | `'en' \| 'fr'`                    | optional | 'en'    | The language to be used in the importer.                                                                                                                                                               |
| returnType       | `'json'  \|  'xslx'  \|  'csv'`   | optional | 'json'  | the data format that the import will return.                                                                                                                                                           |
| metadata         | `unknown`                         | optional |         | Additional data if you would like to send specific data to your server according to the configuration of the destination template (e.g. logged-in user data: `user_id`...). Can hold any type of data. |
| customValidators | `RowslintTemplateCustomValidator` | optional |         | Object to handle custom validations from your code.                                                                                                                                                    |

### `RowslintImportResult`

#### Description

Represents the return of the importer after the modal is closed.

#### Properties

| name     | type                                                            | required | default | description                                                                                                                                                                     |
| -------- | --------------------------------------------------------------- | -------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| status   | `'success' \| 'error' \| 'cancelled'`                           | required |         | `'success'` if import completed successfully, else `'error'`. `'cancelled'` if the user quits without completing the import steps.                                              |
| data     | `{ file?: File; rows?: Array<Record<string, unknown>>; }`       | optional |         | Return the imported file in the `file` property or the JSON data format in the `row` property according to the `returnType` property of the `RowslintTemplateConfig` interface. |
| metadata | `{ is_valid: boolean; file_name: string; sheet_name: string; }` | optional |         | Holds the uploaded file information and the `is_valide` propperty which is `true` when the file is imported respecting all template validations, otherwise `else`.              |

## Examples

### Importer UI

This example demonstrates how to use the importer by displaying the importer UI and listening on the event when the import process is complete.

```ts
import { Component } from '@angular/core';
import { take } from 'rxjs';

import { RowslintService, RowslintTemplateConfig } from '@rowslint/importer-angular';

@Component({
  selector: 'demo-root',
  template: `<button (click)="launch()">Launch</button>`,
})
export class AppComponent {
  config: RowslintTemplateConfig = {
    templateKey: 'TEMPLATE_KEY',
    returnType: 'json',
  };

  constructor(private rowslintService: RowslintService) {}

  launch() {
    this.rowslintService.launch(this.config);
    this.rowslintService.onImport.pipe(take(1)).subscribe((result) => {
      if (result.status === 'success' && result.metadata?.is_valid) {
        // Continue the import process.
      }
    });
  }
}
```

### Headless importer UI

In this example, we will use the importer in the headless mode. To do so, we will use our custom file input field to upload the file, then we will set it to the importer.

```ts
import { Component } from '@angular/core';
import { take } from 'rxjs';

import { RowslintService, RowslintTemplateConfig } from '@rowslint/importer-angular';

@Component({
  selector: 'demo-root',
  template: `
    <input id="file" type="file" />
    <button (click)="launch()">Launch</button>
  `,
})
export class AppComponent {
  config: RowslintTemplateConfig = {
    templateKey: 'TEMPLATE_KEY',
    returnType: 'xslx',
  };

  constructor(private rowslintService: RowslintService) {}

  launch() {
    const inputFile = <HTMLInputElement>document.getElementById('file');
    this.rowslintService.launch(this.config, inputFile?.files?.[0]);
    this.rowslintService.onImport.pipe(take(1)).subscribe((result) => {
      // Continue the import process.
    });
  }
}
```

### Custom validations

We can define a custom configuration of validations from the code. Let's say our template has a "firstname" column. In this example, we will customize the validation of this column to accept only values starting with the letter "A".

```ts
import { Component } from '@angular/core';
import { take } from 'rxjs';

import { RowslintService, RowslintTemplateConfig } from '@rowslint/importer-angular';

@Component({
  selector: 'demo-root',
  template: ` <button (click)="launch()">Launch</button> `,
})
export class AppComponent {
  config: RowslintTemplateConfig = {
    templateKey: 'TEMPLATE_KEY',
    customValidators: {
      firstname: (columnValue) => {
        if (typeof columnValue === 'string' && columnValue.startsWith('A')) {
          // Return `true` if the value is valid.
          return true;
        }
        // Return custom message if the value is invalid.
        return {
          message: 'Must start with the letter "A".',
        };
      },
    },
  };

  constructor(private rowslintService: RowslintService) {}

  launch() {
    this.rowslintService.launch(this.config);
    this.rowslintService.onImport.pipe(take(1)).subscribe((result) => {
      // Continue the import process.
    });
  }
}
```

Note that:

- `firstname` property is the column name and must already be added to the template columns.
- By defining a column custom validation, this will override the column validation type already defined in the template edition page.

We can also return a list of valid values to be displayed in a select field.

```ts
import { Component } from '@angular/core';
import { take } from 'rxjs';

import { RowslintService, RowslintTemplateConfig } from '@rowslint/importer-angular';

@Component({
  selector: 'demo-root',
  template: ` <button (click)="launch()">Launch</button> `,
})
export class AppComponent {
  validValues = ['A', 'B'];
  config: RowslintTemplateConfig = {
    templateKey: 'TEMPLATE_KEY',
    customValidators: {
      firstname: (columnValue) => {
        if (typeof columnValue === 'string' && validValues.includes(columnValue)) {
          // Return `true` if the value is valid.
          return true;
        }
        // Return the `this.validValues` array that will be displayed in a select field.
        return {
          message: 'Must be "A" or "B".',
          validationType: 'choiceList',
          validationOptions: {
            list: this.validValues,
          },
        };
      },
    },
  };

  constructor(private rowslintService: RowslintService) {}

  launch() {
    this.rowslintService.launch(this.config);
    this.rowslintService.onImport.pipe(take(1)).subscribe((result) => {
      // Continue the import process.
    });
  }
}
```

## Documentation

To see the latest documentation, [please click here](https://docs.rowslint.dev)
