import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration
} from '@microsoft/sp-webpart-base';
import { HttpClient, HttpClientResponse } from "@microsoft/sp-http";

import styles from './LatestOrders.module.scss';
import { ILatestOrdersWebPartProps } from './ILatestOrdersWebPartProps';
import { IOrder, Region } from './IOrder';

export default class LatestOrdersWebPart extends BaseClientSideWebPart<ILatestOrdersWebPartProps> {
  private remotePartyLoaded: boolean = false;
  private orders: IOrder[];

  public render(): void {
    this.domElement.innerHTML = `
    <div class="${styles.latestOrders}">
      <iframe src="https://spfx-msgraph.azurewebsites.net/api/graph"
          style="display:none;"></iframe>
      <div class="ms-font-xxl">Loading...</div>
      </br>
      <div class="loading"></div>
      <ul class="data"></ul>
    </div>`;

    //https://azure-ad-demo.neptune-preprod.bris.ac.uk/secure/user

    this.context.statusRenderer.displayLoadingIndicator(
      this.domElement.querySelector(".loading"), "orders");

    this.domElement.querySelector("iframe").addEventListener("load", (): void => {
      this.remotePartyLoaded = true;
    });

    this.executeOrDelayUntilRemotePartyLoaded((): void => {
      this.context.httpClient.get("https://spfx-msgraph.azurewebsites.net/api/graph",
        HttpClient.configurations.v1, {
          credentials: "include"
        })
        .then((response: HttpClientResponse): Promise<any> => {
          
            //console.log(response.text()) ;

            return response.json();      
        })
        .then((user: any): void => {
          
          var data = JSON.parse(user) ;
          console.log(data) ;
          var obj ;
          
          for ( obj in data )
            {
              
              var person = data[obj] ;
              //console.log(person) ;
              for (var item in person)
                {
                 if (person[item].givenName != null && person[item].givenName != "" )
                  {
                   var displayName = "<a href='https://uob.sharepoint.com/_layouts/15/me.aspx/?p=" + person[item].userPrincipalName + "&v=work'target='_blank'><b>"+person[item].displayName+"</b></a><br>" ;  
                   var jobTitle = "Role: " +  person[item].jobTitle + "<br/>" 
                   var phone = "Phone: " + person[item].phones[0].number + "<br/>" ;
                   var email = "Email: " + "<a href= 'mailto:"+person[item].scoredEmailAddresses[0].address+"'>"+person[item].scoredEmailAddresses[0].address+ "</a><br/><br/>" ;
                   
                   //contact = name  + jobTitle + phone  + email + url +  "<br/>" + contact ; 
                   //store.push({name, jobTitle, phone, email, url});
                   const list: Element = this.domElement.querySelector(".data");
                   list.innerHTML += displayName += jobTitle += phone += email   ;

                                 
                   
                  }  
                
                }
            }
            var heading = "Your Favourite Contacts..." ;
            this.domElement.querySelector(".ms-font-xxl").innerHTML= heading;               
           
            this.context.statusRenderer.clearLoadingIndicator(
            this.domElement.querySelector(".loading").innerHTML = null);
            
          
        })
        .catch((error: any): void => {

          this.context.statusRenderer.clearLoadingIndicator(
            this.domElement.querySelector(".loading"));
            //console.log(user) ;
          this.context.statusRenderer.renderError(this.domElement, "Error loading orders: " + (error ? error.message : ""));
        });
    });
  }


  private executeOrDelayUntilRemotePartyLoaded(func: Function): void {
    if (this.remotePartyLoaded) {
      func();
    } else {
      setTimeout((): void => { this.executeOrDelayUntilRemotePartyLoaded(func); }, 100);
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: []
    };
  }
}
