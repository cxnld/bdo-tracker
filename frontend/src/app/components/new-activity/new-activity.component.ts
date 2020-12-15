import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';

import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-new-activity',
  templateUrl: './new-activity.component.html',
  styleUrls: ['./new-activity.component.scss']
})
export class NewActivityComponent implements OnInit {

  constructor(private mainService: MainService, private router: Router, private fb: FormBuilder) { }

  activityForm: FormGroup;

  ngOnInit(): void {
    this.activityForm = this.fb.group({
      title: [],
      items: this.fb.array([this.fb.group({name:null, price:null})])
    })
  }

  get items() {
    return this.activityForm.get('items') as FormArray
  }

  addItem() {
    this.items.push(this.fb.group({name:null, price:null}));
  }

  deleteItem(index: any) {
      this.items.removeAt(index);
  }

  createActivity() {
    if (this.checkForm()) {
      this.mainService.createActivity(this.activityForm.value).subscribe((newActivity: any) => {
        this.router.navigate([ '/activities', newActivity._id ]);
      });
    } else {
      alert("Some entries are missing.");
    }
  }

  checkForm() {
    if (!this.activityForm.value.title) {
      return false
    }

    for (var i=0; i<this.activityForm.value.items.length; i++) {
      if (this.activityForm.value.items[i].name === null || this.activityForm.value.items[i].price === null) {
        return false
      }
    }

    return true
  }


}
