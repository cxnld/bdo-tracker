import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MainViewComponent } from './components/main-view/main-view.component';

import { NewActivityComponent } from './components/new-activity/new-activity.component';
import { NewSessionComponent } from './components/new-session/new-session.component';

import { EditActivityComponent } from './components/edit-activity/edit-activity.component';
import { EditSessionComponent } from './components/edit-session/edit-session.component';

import { UpdateActivityNameComponent } from './components/update-activity-fields/update-activity-name/update-activity-name.component';
import { UpdateActivityItemComponent } from './components/update-activity-fields/update-activity-item/update-activity-item.component';
import { AddActivityItemComponent } from './components/update-activity-fields/add-activity-item/add-activity-item.component';

import { AnalysisComponent } from './components/analysis/analysis.component';


const routes: Routes = [
  { path: '', redirectTo: 'activities', pathMatch: 'full' },
  { path: 'activities', component: MainViewComponent },
  { path: 'activities/:activityID', component: MainViewComponent },

  // Creating new activities or sessions
  { path: 'new-activity', component: NewActivityComponent },
  { path: 'activities/:activityID/new-session', component: NewSessionComponent },

  // Update existing session
  { path: 'activities/:activityID/sessions/:sessionID/edit-session', component: EditSessionComponent },

  // Update existing activity
  { path: 'activities/:activityID/edit-activity', component: EditActivityComponent },
  { path: 'activities/:activityID/edit-activity/update-activity-name', component:UpdateActivityNameComponent },
  { path: 'activities/:activityID/edit-activity/add-activity-item', component: AddActivityItemComponent },
  { path: 'activities/:activityID/edit-activity/:itemID/update-activity-item', component: UpdateActivityItemComponent },

  { path: 'activities/:activityID/analysis', component: AnalysisComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
