import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-new-session',
  templateUrl: './new-session.component.html',
  styleUrls: ['./new-session.component.scss']
})
export class NewSessionComponent implements OnInit {

  constructor(private route: ActivatedRoute, private mainService: MainService, private router: Router, private fb: FormBuilder) { }

  sessionForm: FormGroup;
  activityID: String;
  itemsRetrieved: any;

  ngOnInit(): void {

    this.route.params.subscribe(
      (params: Params) => {
        this.activityID = params.activityID;
        // local copy of activity
        this.mainService.getActivity(params.activityID).subscribe((activity: any) => {
          this.itemsRetrieved = activity.items;
          console.log(this.items);
          this.setInput();
        })
      }
    )

    this.sessionForm = this.fb.group(
      {
        title: [],
        time: this.fb.group({hours:null, minutes:null}),
        items: this.fb.array([this.fb.group({name:null, quantity:null})]),
      }
    )

  }

  get items() {
    return this.sessionForm.get('items') as FormArray
  }

  get time() {
    return this.sessionForm.get('time') as FormArray
  }

  setInput() {
    this.items.removeAt(0);
    for (var i=0; i< this.itemsRetrieved.length; i++) {
      let itemName = this.itemsRetrieved[i].name;
      this.items.push(this.fb.group({name: itemName, quantity: '', _itemID: this.itemsRetrieved[i]._id}));
    }
  }

  createSession() {
    if (this.checkForm()){
      this.mainService.createSession(this.activityID, this.sessionForm.value).subscribe(() => {
        this.router.navigate([ '/activities', this.activityID ]);
      });
    } else {
      alert("Some entries are missing.");
    }

  }

  checkForm() {
    if (this.sessionForm.value.title === null || this.sessionForm.value.title === '') {
      return false
    }

    for (var i=0; i<this.sessionForm.value.items.length; i++) {
      if (this.sessionForm.value.items[i].name === null|| this.sessionForm.value.items[i].quantity === null) {
        return false
      }
    }

    if (this.sessionForm.value.time.hours === null || this.sessionForm.value.time.minutes === null) {
      return false
    }

    return true
  }


}
