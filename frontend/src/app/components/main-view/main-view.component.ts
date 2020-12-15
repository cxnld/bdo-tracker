import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  selectedActivityID: String;

  activities: any;
  sessions: any;

  constructor(private mainService: MainService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      if (params.activityID) {
        this.selectedActivityID = params.activityID;
        this.mainService.getSessions(params.activityID).subscribe((sessions: any) => {this.sessions = sessions} )
      } else {
        this.sessions = undefined;
      }
    });

    this.mainService.getActivities().subscribe((activities: any) => {
      this.activities = activities;
    });

  }

  onDeleteActivityClick() {
    this.mainService.deleteActivity(this.selectedActivityID).subscribe((res: any) => {
      this.router.navigate(['/activities']);
      console.log(res);
    });
  }

  onDeleteSessionClick(sessionID: String) {
    this.mainService.deleteSession(this.selectedActivityID, sessionID).subscribe((res: any) => {
      this.sessions = this.sessions.filter((session: any) => session._id !== sessionID);
      console.log(res);
    })
  }

}
