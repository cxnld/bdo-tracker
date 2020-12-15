import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-add-activity-item',
  templateUrl: './add-activity-item.component.html',
  styleUrls: ['./add-activity-item.component.scss']
})
export class AddActivityItemComponent implements OnInit {

  activityID: string;

  constructor(private route: ActivatedRoute, private mainService: MainService, private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.activityID = params.activityID;
    })
  }

  addItem(name: any, price: any) {
    if (this.checkForm(name, price)) {
      this.mainService.addActivityItem(this.activityID, { "name": name, "price": price }).subscribe(() => {
        //console.log("Added a new item to the activity");
        this.router.navigate(['/activities', this.activityID, 'edit-activity']);
      })
    } else {
      alert("Some entries are missing.");
    }
  }

  checkForm(name: any, price: any) {
    if (!name || !price) {
      return false
    }
    return true
  }

}
