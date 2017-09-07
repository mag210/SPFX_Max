import * as React from 'react';
import styles from './HelloWorldReact.module.scss';
import { IHelloWorldReactProps } from './IHelloWorldReactProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Button, ButtonType, Nav, Panel, PanelType,  SearchBox} from 'office-ui-fabric-react';
import { Dropdown} from 'office-ui-fabric-react/lib/Dropdown';
import { HttpClient, HttpClientResponse } from "@microsoft/sp-http";





export default class HelloWorldReact extends React.Component<IHelloWorldReactProps, any> {

  constructor(props: IHelloWorldReactProps,) {
    super(props);
    this.state = {
      showPanel: false,
      selectedItem: null
    };
  }
  
  public render(): JSX.Element {


    let { selectedItem } = this.state;
    try {
      let feed = selectedItem.key ;
      if (feed != null)
        {
          this.getData(feed);
        }

    } catch (error) {
      console.log("nothing set") ;
    }
   
    
    return (
      <div>
        <div className='ms-BasicButtonsExample'>
          <Button
            data-automation-id='test'>Normal button</Button>
          <Button
            data-automation-id='test'
            buttonType={ButtonType.primary} onClick={this._buttonOnClickHandler.bind(this)}>Primary button</Button>
        </div>

      
      <div className='dropdownExample'>

        <Dropdown 
          //placeHolder='Select an Option'
          
          label='Basic uncontrolled example:'
          id='Basicdrop1'
          defaultSelectedKey='D'
          ariaLabel='Basic dropdown example'
          selectedKey={ selectedItem && selectedItem.key }
          onChanged={ (item) => this.setState({ selectedItem: item }) }
          
          options={
            [
              { key: 'A', text: 'Option a' },
              { key: 'B', text: 'Option b' },
              { key: 'C', text: 'Option c' },
              { key: 'D', text: 'Option d' },
              { key: 'E', text: 'Option e' },
              { key: 'F', text: 'Option f' },
              { key: 'G', text: 'Option g' },
              
            ]
          }
        />

        
         
        </div>
       

        <div className='ms-SearchBoxSmallExample'>
        <SearchBox
          onChange={ (newValue) => console.log('SearchBox onChange fired: ' + newValue) }
          onSearch={ (newValue) => console.log('SearchBox onSearch fired: ' + newValue) }
        />
      </div>

        
        

        <div className='ms-PanelExample'>
          <Button description='Opens the Sample Panel' onClick={this._showPanel.bind(this)}>Open Panel</Button>
          <Panel
            isOpen={this.state.showPanel}
            type={PanelType.smallFixedFar}
            onDismiss={this._closePanel.bind(this)}
            headerText='Panel - Small, right-aligned, fixed'>
            <span className='ms-font-m'>Content goes here.</span>
          </Panel>
        </div>
      </div>
    );
  }

  private _buttonOnClickHandler() {
    alert('You clicked the primary button');
    return false;
  }

  private _navOnClickHandler() {
    alert('You clicked the edit button in navigation');
    return false;
  }

  private _showPanel() {
    this.setState({ showPanel: true });
  }

  private _closePanel() {
    this.setState({ showPanel: false });
  }


  private getSelect(this) {

    //console.log(selectedItem.text) ;
   //(item) => this.setState({ selectedItem: item }) ;

   var test = document.getElementById("Basicdrop1") ; 
   console.log(test) ;
    

  return  this.props.HttpClient.get("https://www.bris.ac.uk/events/events-rss.xml",
    HttpClient.configurations.v1, {
    })
    .then((response: HttpClientResponse): Promise<any> => {

        return response.text();      
    })
    .then((data: any): void => {
      console.log(data) ;

    })
    .catch((error: any): void => {
      console.log(error) ;

    });
    
    
   
    

  }


  public getData(feed)
  {
    console.log(feed) ;
    this.props.HttpClient.get("https://spfx-getevents.azurewebsites.net/",
    HttpClient.configurations.v1, {
      mode: 'cors'
    })
    .then((response: HttpClientResponse): Promise<any> => {

        return response.text();      
    })
    .then((data: any): void => {
      
      var events = JSON.parse(data) ;
     
      var items = events.items ;
      console.log(items) ;
     
      for (var item in items)
        {
          
          console.log(items[item].title) ;
        }




    })
    .catch((error: any): void => {
      console.log(error) ;

    });


  }
}


