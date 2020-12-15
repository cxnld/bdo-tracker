import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-update-activity-item',
  templateUrl: './update-activity-item.component.html',
  styleUrls: ['./update-activity-item.component.scss']
})
export class UpdateActivityItemComponent implements OnInit {

  constructor(private route: ActivatedRoute, private mainService: MainService, private router: Router) { }

  activityID: String;
  itemID: String;

  itemInfo: any;


  ngOnInit() {
    this.route.params.subscribe((params: Params) => {
      this.activityID = params.activityID;
      this.itemID = params.itemID;
      this.mainService.getActivity(this.activityID).subscribe((activity: any) => {

        for (var i=0; i<activity.items.length; i++) {
          if (activity.items[i]._id === this.itemID) {
            this.itemInfo = activity.items[i];
          }
        }
        //console.log(this.itemInfo);

      })
    })
  }

  updateItem(name: any, price: any) {
    if (this.checkForm(name, price)) {
      this.mainService.updateActivityItem(this.activityID, this.itemID, { "name": name, "price": price }).subscribe(() => {
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
