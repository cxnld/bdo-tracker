import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root'
})
export class MainService {

  constructor(private webReqService: WebRequestService) { }

/***********************************************************************************************/

  getActivities() {
    return this.webReqService.get('activities');
  }

  getActivity(id: String) {
    return this.webReqService.get(`activities/${id}`);
  }

  createActivity(payload: Object) {
    return this.webReqService.post('activities', payload);
  }

  deleteActivity(id: String) {
    return this.webReqService.delete(`activities/${id}`);
  }

/***********************************************************************************************/

  updateActivityName(activityID: String, payload: Object) {
    return this.webReqService.patch(`activities/${activityID}/edit-activity/update-activity-name`, payload);
  }

  addActivityItem(activityID: String, payload: Object) {
    return this.webReqService.post(`activities/${activityID}/edit-activity/add-activity-item`, payload);
  }

  updateActivityItem(activityID: String, itemID: String, payload: Object) {
    return this.webReqService.patch(`activities/${activityID}/edit-activity/${itemID}/update-activity-item`, payload);
  }

  deleteActivityItem(activityID: String, itemID: String) {
    return this.webReqService.delete(`activities/${activityID}/edit-activity/${itemID}`);
  }

/***********************************************************************************************/

  getSessions(activityID: String) {
    return this.webReqService.get(`activities/${activityID}/sessions`);
  }

  getSession(activityID: String, sessionID: String) {
    return this.webReqService.get(`activities/${activityID}/sessions/${sessionID}`);
  }

  createSession(activityID: String, payload: Object) {
    return this.webReqService.post(`activities/${activityID}/sessions`, payload);
  }

  updateSession(activityID: String, sessionID: String, payload: Object) {
    return this.webReqService.patch(`activities/${activityID}/sessions/${sessionID}`, payload);
  }

  deleteSession(activityID: String, sessionID: String) {
    return this.webReqService.delete(`activities/${activityID}/sessions/${sessionID}`);
  }


}
