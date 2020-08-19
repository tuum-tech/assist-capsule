import { Component, OnInit, Input } from '@angular/core';
import { RequestDTO } from '../../models/request.model';
import * as moment from 'moment'
import { DomSanitizer } from '@angular/platform-browser';
import { VerifiableCredentialDTO, DocumentSearchDTO, DocumentDTO } from 'src/app/models/documentsearch.model';
import { AppService } from 'src/app/services/app.service';
@Component({
  selector: 'did-document',
  templateUrl: './diddocument.component.html',
  styleUrls: ['./diddocument.component.scss'],
})
export class DidDocumentComponent implements OnInit {
 
  @Input() did: string;
  @Input() isLatest: boolean;
  @Input() document: DocumentDTO;
  @Input() highlight: string;

  constructor(private sanitizer: DomSanitizer, private appService: AppService) {}

  ngOnInit() {
   
  }

  get credentials(): VerifiableCredentialDTO[]{
    let response: VerifiableCredentialDTO[] = []
    
    
    this.document.verifiable_creds.forEach(item =>{
      if (item.id != "#avatar") response.push(item)
    })

    return response
  }

  get avatar() : string{
    let avatar = "../../../assets/images/icon-Profile.png"

    this.document.verifiable_creds.forEach(item =>{
      if (item.id == "#avatar") {
        avatar = this.appService.getBase64Image(item.subject["avatar"])
      }
    })

    return avatar
  }

  getCaptalizedHeader(item: VerifiableCredentialDTO){
    let header = item.id.replace("#", "");
    return header.charAt(0).toUpperCase() + header.slice(1) + ":";
  }

  getValue(item: VerifiableCredentialDTO){
    let subject = item.subject[item.id.replace("#", "")]
    if (subject !== Object(subject)) return subject
    return ""
  }

  isVerified(item: VerifiableCredentialDTO){
      return !item.type.includes("SelfProclaimedCredential")
  }

  isExpired(item: VerifiableCredentialDTO) : boolean
  {
    let expiration = moment(item.expiration_date)
    return expiration < moment()
  }

  isVerifiedAndExpired(item){
      if (item.type.includes("SelfProclaimedCredential")) return false
  }
  



 
}