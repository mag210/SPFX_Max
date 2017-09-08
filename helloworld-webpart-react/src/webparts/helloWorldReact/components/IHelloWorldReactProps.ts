import { HttpClient } from '@microsoft/sp-http';


export interface IHelloWorldReactProps {
  description: string;
  HttpClient: HttpClient;
  items: any[] ;
}
