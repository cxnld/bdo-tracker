import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { MainService } from 'src/app/services/main.service';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CombinedSessions } from 'src/app/models/combined-sessions.model';

@Component({
  selector: 'app-analysis',
  templateUrl: './analysis.component.html',
  styleUrls: ['./analysis.component.scss']
})
export class AnalysisComponent implements OnInit {

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA']
  };

  constructor(private mainService: MainService, private route: ActivatedRoute, private router: Router) { }

  view: any = [700, 400];

  activityID: String;
  activityInfo: any;
  arrayOfSessions: any;
  isDataLoaded: boolean = false;

  sessionsCombined: CombinedSessions = {
    time: {
      hours: 0,
      minutes: 0
    },
    items: []
  };

  graphData: any[] = [];

  hours: number;
  minutes: number;
  totalMoneyMade: number = 0;
  moneyPerHour: number = 0;


  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.activityID = params.activityID;
      this.mainService.getActivity(params.activityID).subscribe((activity) => {
        this.activityInfo = activity;
      });
      this.mainService.getSessions(params.activityID).subscribe((sessions) => {
        this.arrayOfSessions = sessions;
        this.combineSessions(this.arrayOfSessions);
      });
    });
  }

  combineSessions(arrayOfSessions: any) {

    for (var j=0; j<this.activityInfo.items.length; j++) {
      this.sessionsCombined.items.push(
        {
          itemID: this.activityInfo.items[j]._id,
          name: this.activityInfo.items[j].name,
          price: this.activityInfo.items[j].price,
          totalQuantity: 0,
          averageQuantity: 0,
          moneyPerHour: 0
        });
    };
    console.log("Created items in sessionCombined");

    // For each session
    for (var i=0; i<arrayOfSessions.length; i++) {
      console.log("LOOKING AT SESSION: ", arrayOfSessions[i].title);
      this.sessionsCombined.time.hours += arrayOfSessions[i].time.hours;
      this.sessionsCombined.time.minutes += arrayOfSessions[i].time.minutes;
      console.log("   Added times from ", arrayOfSessions[i].title);

      // For each item in the session
      for (var k=0; k<arrayOfSessions[i].items.length; k++) {
        console.log("      LOOKING AT ITEM ", arrayOfSessions[i].items[k].name);

        // Match the item to its corresponding item in sessionsCombined
        for (var x=0; x<this.sessionsCombined.items.length; x++) {
          console.log("         Looping through sessionsCombined, looking at item ", this.sessionsCombined.items[x].name);
          if ( arrayOfSessions[i].items[k]._itemID === this.sessionsCombined.items[x].itemID) {
            console.log("            Match found, itemID is same.");
            this.sessionsCombined.items[x].totalQuantity += arrayOfSessions[i].items[k].quantity;
          }
        }
      }
    }
    this.hours = this.sessionsCombined.time.hours + Math.floor(this.sessionsCombined.time.minutes/60);
    this.minutes = this.sessionsCombined.time.minutes%60;
    // Find the total time in minutes
    var totalTimeInMinutes = (this.sessionsCombined.time.hours * 60) + this.sessionsCombined.time.minutes;

    // Go through each item in sessionsCombined and set values for averageQuantity and moneyPerHour
    for (var y=0; y<this.sessionsCombined.items.length; y++) {
      this.totalMoneyMade += this.sessionsCombined.items[y].price * this.sessionsCombined.items[y].totalQuantity;
      this.sessionsCombined.items[y].averageQuantity = (this.sessionsCombined.items[y].totalQuantity / totalTimeInMinutes) * 60;
      this.sessionsCombined.items[y].moneyPerHour = this.sessionsCombined.items[y].averageQuantity * this.sessionsCombined.items[y].price;

      this.graphData.push( { "name": this.sessionsCombined.items[y].name, "value": this.sessionsCombined.items[y].moneyPerHour } );
    }

    this.totalMoneyMade = this.totalMoneyMade;
    this.moneyPerHour = this.totalMoneyMade/totalTimeInMinutes*60;

    this.isDataLoaded = true;
    console.log(this.sessionsCombined);
    //console.log(this.graphData);
  }


}
