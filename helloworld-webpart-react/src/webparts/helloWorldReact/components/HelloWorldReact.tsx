import * as React from 'react';
import styles from './HelloWorldReact.module.scss';
import { IHelloWorldReactProps } from './IHelloWorldReactProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Button, ButtonType, Nav, Panel, PanelType,  SearchBox} from 'office-ui-fabric-react';
import { Dropdown} from 'office-ui-fabric-react/lib/Dropdown';
import { HttpClient, HttpClientResponse } from "@microsoft/sp-http";
import {
  css,
  getRTL
} from 'office-ui-fabric-react/lib/Utilities';
import { FocusZone, FocusZoneDirection } from 'office-ui-fabric-react/lib/FocusZone';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import { Image, ImageFit } from 'office-ui-fabric-react/lib/Image';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { List } from 'office-ui-fabric-react/lib/List';



export default class HelloWorldReact extends React.Component<IHelloWorldReactProps, any> {

  constructor(props: IHelloWorldReactProps,) {
    super(props);
    this._onFilterChanged = this._onFilterChanged.bind(this);
    this.state = {
      showPanel: false,
      selectedItem: null,
      items: null,
      filterText: '',
    };
  }
  
  public render(): JSX.Element {

    console.log(this.state) ;

    var appState = this.state ;
    var data ;
    try 
    {
        if (appState.items != null)
          {
            data = appState.items ;
           // console.log(data) ;
          }
        else if(appState.selectedItem != null)
        {
          let feed = appState.selectedItem.key ;
          //console.log(feed) ;
          this.getData(feed);
        }
        else
        {
          console.log("No data and no feed, loading app") ;
        }  
    
  }
  catch (error)
  {
    console.log(error) ;
  }

    let resultCountText = 1 ;
  
   
    
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
          //selectedKey={ selectedItem && selectedItem.key }
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
     

        <FocusZone direction={ FocusZoneDirection.vertical }>
          <TextField label={ 'Filter by title' } onBeforeChange={ this._onFilterChanged } />
          <List
            items={ this.state.items }
            onRenderCell={ (item, index) => (
              <div className='ms-ListBasicExample-itemCell' data-is-focusable={ true }>
                <Image
                  className='ms-ListBasicExample-itemImage'
                  src={ item.thumbnail }
                  width={ 50 }
                  height={ 50 }
                  imageFit={ ImageFit.cover }
                />
                <div className='ms-ListBasicExample-itemContent'>
                  <div className='ms-ListBasicExample-itemName'>{ item.title }</div>
                  <div className='ms-ListBasicExample-itemIndex'>{ `Item ${index}` }</div>
                  <div className='ms-ListBasicExample-itemDesc'>{ item.description }</div>
                </div>
                <Icon
                  className='ms-ListBasicExample-chevron'
                  iconName={ getRTL() ? 'ChevronLeft' : 'ChevronRight' }
                />
              </div>
            ) }
          />
        </FocusZone>
</div>

    );
  }

  private _onFilterChanged(text: string) {
    let data = this.state ;
    let items = this.state.items ;

    console.log(items) ;

    try{

    this.setState({
      filterText: text,
      items: text ?
        items.filter(item => item.title.toLowerCase().indexOf(text.toLowerCase()) >= 0) :
        items
    });

  }
  catch (error)
  {
    console.log(error) ;
  }
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
    

  return  this.props.HttpClient.get("https://www.bris.ac.uk/events/events-rss.xml",
    HttpClient.configurations.v1, {
    })
    .then((response: HttpClientResponse): Promise<any> => {

        return response.text();      
    })
    .then((data: any): void => {
      //console.log(data) ;

    })
    .catch((error: any): void => {
      console.log(error) ;

    });
    
    
   
    

  }


  public getData(feed)
  {
    let items ;
    this.props.HttpClient.get("https://spfx-getevents.azurewebsites.net/",
    HttpClient.configurations.v1, {
      mode: 'cors'
    })
    .then((response: HttpClientResponse): Promise<any> => {

        return response.text();      
    })
    .then((data: any): void => {
      
      var events = JSON.parse(data) ;
     
      items = events.items ;
     // console.log(items) ;
     
      for (var item in items)
        {
          //console.log(items[item].title) ;
        }
        //console.log(items) ;
        this.setState({ items: items }) ;

        
        
    })
    .catch((error: any): void => {
      console.log(error) ;
      
      

    });
    
    

  }
}


