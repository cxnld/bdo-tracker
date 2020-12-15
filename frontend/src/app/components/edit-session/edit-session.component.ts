import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

@Component({
  selector: 'app-edit-session',
  templateUrl: './edit-session.component.html',
  styleUrls: ['./edit-session.component.scss']
})
export class EditSessionComponent implements OnInit {

  constructor(private route: ActivatedRoute, private mainService: MainService, private router: Router, private fb: FormBuilder) { }


  activityID: String;
  sessionID: String;
  session: any;

  sessionForm: FormGroup;


  ngOnInit(): void {

    this.route.params.subscribe((params: Params) => {
        this.activityID = params.activityID;
        this.sessionID = params.sessionID;
        this.mainService.getSession(params.activityID, params.sessionID).subscribe((session) => {
          this.session = session;
          console.log(this.session);
          this.setItem();
        })
      }
    )

    this.sessionForm = this.fb.group(
      {
        title: [],
        time: this.fb.group({hours:'', minutes:''}),
        items: this.fb.array([this.fb.group({name:'', quantity:''})])
      }
    )

  }

  get items() {
    return this.sessionForm.get('items') as FormArray
  }

  get title() {
    return this.sessionForm.get('title') as FormControl
  }

  get time() {
    return this.sessionForm.get('time') as FormControl
  }

  addItem() {
    this.items.push(this.fb.group({name:'', price:''}));
  }

  deleteItem(index: any) {
    this.items.removeAt(index);
  }

  setItem() {
    this.title.setValue(this.session.title);
    this.time.setValue( { hours: this.session.time.hours, minutes: this.session.time.minutes } );
    //this.time.setValue( [this.session.time.hours, this.session.time.minutes] );
    this.items.removeAt(0);
    for (var i=0; i< this.session.items.length; i++) {
      let x = this.session.items[i].name;
      let y = this.session.items[i].quantity;
      let z = this.session.items[i]._itemID;
      this.items.push(this.fb.group({name:x, quantity:y, _itemID:z}));
    }
  }

  updateSession() {
    if (this.checkForm()){
      this.mainService.updateSession(this.activityID, this.sessionID, this.sessionForm.value).subscribe(() => {
        this.router.navigate([ '/activities', this.activityID ]);
      });
    } else {
      alert("Some entries are missing.");
    }
  }

  checkForm() {
    if (!this.sessionForm.value.title) {
      return false
    }

    if (this.sessionForm.value.time.hours === null || this.sessionForm.value.time.minutes === null) {
      return false
    }

    for (var i=0; i<this.sessionForm.value.items.length; i++) {
      if (this.sessionForm.value.items[i].quantity === '') {
        return false
      }
    }

    return true
  }

}
