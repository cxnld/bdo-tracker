import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-edit-activity',
  templateUrl: './edit-activity.component.html',
  styleUrls: ['./edit-activity.component.scss']
})
export class EditActivityComponent implements OnInit {

  constructor(private route: ActivatedRoute, private mainService: MainService, private router: Router, private fb: FormBuilder) { }

  activityID: String;
  activity: any;

  activityForm: FormGroup;

  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
        this.activityID = params.activityID;
        // local copy of activity
        this.mainService.getActivity(params.activityID).subscribe((activity) => {
          this.activity = activity;
          //console.log(this.activity);
          this.setItem();
        })
      }
    )

    this.activityForm = this.fb.group(
      {
        title: [],
        items: this.fb.array([this.fb.group({name:null, price:null})])
      }
    )

  }


  get items() {
    return this.activityForm.get('items') as FormArray
  }

  get title() {
    return this.activityForm.get('title') as FormControl
  }

  addItem() {
    this.router.navigate([ '/activities', this.activityID, 'edit-activity', 'add-activity-item']);
  }

  deleteItem(index: any) {
    let deletedItemID = this.activity.items[index]._id;

    this.items.removeAt(index);
    this.mainService.deleteActivityItem(this.activityID, deletedItemID).subscribe(() => {
      //console.log("Removed an item");
    })
  }

  setItem() {
    this.title.setValue(this.activity.title);
    this.items.removeAt(0);
    for (var i=0; i< this.activity.items.length; i++) {
      let x = this.activity.items[i].name;
      let y = this.activity.items[i].price;
      let z = this.activity.items[i]._id;
      this.items.push(this.fb.group({name:x, price:y, id:z}));
    }
  }

  editItem(itemID: String) {
    this.router.navigate(['/activities', this.activityID, 'edit-activity', itemID, 'update-activity-item']);
  }

  editName() {
    this.router.navigate(['/activities', this.activityID, 'edit-activity', 'update-activity-name']);
  }


}
