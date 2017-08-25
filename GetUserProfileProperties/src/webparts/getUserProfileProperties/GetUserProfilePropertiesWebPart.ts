
import * as pnp from 'sp-pnp-js';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import {Web} from 'sp-pnp-js' ;
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './GetUserProfileProperties.module.scss';
import { SPComponentLoader } from '@microsoft/sp-loader';

import * as strings from 'getUserProfilePropertiesStrings';
import { IGetUserProfilePropertiesWebPartProps } from './IGetUserProfilePropertiesWebPartProps';

//Graph Http client
import { GraphHttpClient, GraphClientResponse } from '@microsoft/sp-http';


export default class GetUserProfilePropertiesWebPart extends BaseClientSideWebPart<IGetUserProfilePropertiesWebPartProps> {

  public onInit(): Promise<void> {

  return super.onInit().then(_ => {

    pnp.setup({
      spfxContext: this.context
    });
    
  });
}


public GetUserProperties(query): any {

  //var site = new Web(this.context.pageContext.web.absoluteUrl);

  
  console.log(query) ;
  var loading ;
  loading = (<HTMLInputElement>document.getElementById('loading')).style.display = "block" ;
 

//Get all user profile properties of given user
var result = {} ; 
var loginName ; 
var filter = "Title eq '"+query + "'" ;
console.log(filter); 
//pnp.sp.profiles.getPropertiesFor("i:0#.f|membership|ciago@bristol.ac.uk").then(function(result) {

  //get the web site address
  /*
  var siteUrl ;
  pnp.sp.web.siteUsers.get().then(function(web) {
   // alert ("Title: " + web.Url + "\r\n" + "Description: " + web.Description);
   console.log(web) ;
});*/



  //site.siteUsers.filter(filter).get().then(function(result) {
  pnp.sp.web.siteUsers.filter(filter).get().then(function(result) {

    try 
    {
      loginName = result[0].LoginName ;
      console.log("hello" + loginName) ;
    } 
    catch (error) {

      var error = "Unable to find user" ;
      console.log(error) ;
      document.getElementById("spUserProfileProperties").innerHTML = error ;
      loading = (<HTMLInputElement>document.getElementById('loading')).style.display = "none" ;
      return ;  
    }
   
    
   console.log(pnp.sp.profiles) ;
   
    pnp.sp.profiles.getPropertiesFor(loginName).then(function(result) {
    //site.profiles.getPropertiesFor(loginName).then(function(result) {  
   
    var userInfo ;
    var prop = "";
    var userProperties = result;
    var email ;
    var phone ; 
    var firstName ;
    var lastName ;
    var department ;
    var title ;
    var picture ;
    var userName ;

     for (prop in result) {
        //userInfo += prop + " : " + result[prop] + "<br/>";
        if (prop == "LoginName")
          {
            loginName = result[prop] ;       
          }

          if (prop == "UserProfileProperties") {
            var userProfileProp = result[prop] ;

            for(var i=0; i< userProfileProp.length; i++) {
              //console.log(users[i]);
              var userProp = userProfileProp[i] ;
              //console.log(userProp)
              if (userProp.Key == "WorkEmail")
                {
                  //console.log(userProp)
                  email = userProp.Value ;
                } 
              if (userProp.Key == "FirstName")
                {        
                  firstName = userProp.Value ;
                }
              if (userProp.Key == "LastName")
                {
                  //console.log(userProp)
                  lastName = userProp.Value ;
                }
               if (userProp.Key == "WorkPhone")
                {
                  phone = userProp.Value ;
                } 
            
              if (userProp.Key == "Department")
                {
                  //console.log(userProp)
                  department = userProp.Value ;
                }
              if (userProp.Key == "Title")
                {
                  //console.log(userProp)
                  title = userProp.Value ;
                }
              if (userProp.Key == "PictureURL")
                {
                  //console.log(userProp)
                  picture = userProp.Value ;
                }
              if (userProp.Key == "UserName")
                {
                  //console.log(userProp)
                  userName = userProp.Value ;
                }           
            }
          }
          //console.log(result[prop][0]) ;
  
  //userPropertyValues += property.Key + " - " + property.Value + "<br/>";
          }

  var name = firstName + " " + lastName + "<br/>" ;
  phone = "Phone Number: +" +  phone + "<br/>" ;
  email = "email address: " + email + "<br/>" ;
  department = "Department: " + department + "</br>" ;
  title = "Title: " + title + "</br>" ;
  picture = '<img style="float:right" class="displayPic" src="'+picture+'" alt="display Picture" height="128" width="128">' ;
  var url = "<a href='https://uobdev.sharepoint.com/_layouts/15/me.aspx/?p=" + userName + "&v=work'target='_blank'>View Profile</a>" ;
  document.getElementById("spUserProfileProperties").innerHTML = name + phone + email + department + title + picture + url ;
  loading = (<HTMLInputElement>document.getElementById('loading')).style.display = "none" ;
}).catch(function(err) {
    console.log("Error: " + err);
});

});

}

  public render(): void {

    this.context.graphHttpClient.get("v1.0/groups", GraphHttpClient.configurations.v1)
      .then((response: GraphClientResponse): Promise<any> => {
        return response.json();
      })
      .then((data: any): void => {
        console.log(data) ;
      });

    SPComponentLoader.loadCss('https://maxcdn.bootstrapcdn.com/font-awesome/4.6.3/css/font-awesome.min.css');
    this.domElement.innerHTML = `
     <div class="${styles.helloWorld}">
  <div class="${styles.container}">
    <div class="ms-Grid-row ms-bgColor-teal ms-fontColor-white ${styles.row}">
      <div class="ms-Grid-col ms-u-lg10 ms-u-xl8 ms-u-xlPush2 ms-u-lgPush1">
        <span class="ms-font-xl ms-fontColor-white" style="font-size:28px">Search for a user in this site..</span>
        <br><br>
        <input class="userProfileInput ${styles.userProfileInput}" type="text" name="searchInput" id="searchInput" placeholder="Enter full name here">
        <br><br>
        <input class="userProfileSubmit ${styles.userProfileSubmit}" type="submit" name="search" id="search">
        <span id="loading" class="loading fa fa-spinner fa-spin fa-3x fa-fw ${styles.loading}" ></span>
        <!--<p class="ms-font-l ms-fontColor-white" style="text-align: left">Demo : Retrieve User Profile Properties</p>-->
      </div>
    </div>
    <div class="ms-Grid-row ms-bgColor-teal ms-fontColor-white ${styles.row}">
    <div style="background-color:Black;color:white;text-align: center;font-weight: bold;font-size:18px;">User Profile Details</div>
    <br>
<div id="spUserProfileProperties" />
    </div>
  </div>
</div>`;

var search = document.getElementById('search');
search.addEventListener('click', function () {
  var query = (<HTMLInputElement>document.getElementById('searchInput')).value;
  //console.log(query) ;
  var user = new GetUserProfilePropertiesWebPart
  //define site object
  user.GetUserProperties(query) ;


  });
  
}

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}

