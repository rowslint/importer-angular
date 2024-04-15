import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { RowslintModule } from '@rowslint/importer-angular';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, RowslintModule.forRoot({ apiKey: '' })],
  bootstrap: [AppComponent],
})
export class AppModule {}
