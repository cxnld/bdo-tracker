import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { MatIconModule } from '@angular/material/icon';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { MainViewComponent } from './components/main-view/main-view.component';

import { NewActivityComponent } from './components/new-activity/new-activity.component';
import { NewSessionComponent } from './components/new-session/new-session.component';

import { EditActivityComponent } from './components/edit-activity/edit-activity.component';
import { EditSessionComponent } from './components/edit-session/edit-session.component';

import { UpdateActivityNameComponent } from './components/update-activity-fields/update-activity-name/update-activity-name.component';
import { UpdateActivityItemComponent } from './components/update-activity-fields/update-activity-item/update-activity-item.component';
import { AddActivityItemComponent } from './components/update-activity-fields/add-activity-item/add-activity-item.component';

import { AnalysisComponent } from './components/analysis/analysis.component';



@NgModule({
  declarations: [
    AppComponent,
    MainViewComponent,
    NewActivityComponent,
    NewSessionComponent,
    EditActivityComponent,
    EditSessionComponent,
    UpdateActivityItemComponent,
    AddActivityItemComponent,
    UpdateActivityNameComponent,
    AnalysisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatIconModule,
    ReactiveFormsModule,
    NgxChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
