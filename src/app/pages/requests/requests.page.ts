import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AppService } from 'src/app/services/app.service';
import { RequestsService } from 'src/app/services/requests.service';
import { RequestDTO } from 'src/app/models/request.model';

declare let appManager: AppManagerPlugin.AppManager;
declare let titleBarManager: TitleBarPlugin.TitleBarManager;

@Component({
  selector: 'page-requests',
  templateUrl: 'requests.page.html',
  styleUrls: ['./requests.page.scss'],
})
export class RequestsPage {

  public title: string = ""
  public requests: RequestDTO[] = []
  public search: string = ""

  constructor(public navCtrl: NavController, private appService: AppService, private requestService: RequestsService) {
    if (!AppService.signedIdentity || AppService.signedIdentity.didString == "") {
      this.navCtrl.navigateForward(['onboarding', { replaceUrl: true }]);
    }
  }

  async ionViewDidEnter() {
    // When the main screen is ready to be displayed, ask the app manager to make the app visible,
    // in case it was started hidden while loading.
    appManager.setVisible("show");

    // Update system status bar every time we re-enter this screen.
    this.appService.setTitleBar();
    this.appService.setBack(()=>{
      this.goBack()
    })
  }

  async ionViewWillEnter(){
    if (RequestsService.requestsList == "identification") this.title = "ID Publish"
    if (RequestsService.requestsList == "media") this.title = "Media Uploads"

    await this.getRequests()
  } 

  async getRequests() {
    var response = await this.requestService.getRequestsFromDidSessionAndType(RequestsService.requestsList);
    this.requests = response
  }

  filterList(value) {
    this.search = value;
  }


  get filterRequests(): RequestDTO[] {

    if (this.search == "") return this.requests;
    let items = []
    this.requests.forEach((request, index) => {
      let indexFound = request.id.toUpperCase().lastIndexOf(this.search.toUpperCase())
      if (indexFound >= 0) {
        items.push(request);
      }
    })

    return items
  }

  openRequest(requestId: string) {
    RequestsService.requestId = requestId
    this.navCtrl.navigateForward(['details']);
  }
  goBack() {
    this.navCtrl.back();
  }

  async doRefresh(evnt){
    await this.getRequests()
    evnt.target.complete();
  }
}
