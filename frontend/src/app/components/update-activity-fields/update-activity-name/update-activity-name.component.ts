import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-update-activity-name',
  templateUrl: './update-activity-name.component.html',
  styleUrls: ['./update-activity-name.component.scss']
})
export class UpdateActivityNameComponent implements OnInit {

  activityID: String;
  ogname: String;

  constructor(private route: ActivatedRoute, private mainService: MainService, private router: Router) { }

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
      this.activityID = params.activityID;
      this.mainService.getActivity(params.activityID).subscribe((activity: any) => {
        this.ogname = activity.title;
      })
    })

  }

  updateName(name: String) {
    if (name) {
      this.mainService.updateActivityName(this.activityID, { "title": name }).subscribe(() => {
        console.log("Activity name has been updated");
        this.router.navigate(['/activities', this.activityID, 'edit-activity']);
      });
    } else {
      alert("Some entries are missing.");
    }
  }

}
