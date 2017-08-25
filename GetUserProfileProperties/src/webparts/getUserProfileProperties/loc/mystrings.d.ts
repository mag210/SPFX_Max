declare interface IGetUserProfilePropertiesStrings {
  PropertyPaneDescription: string;
  BasicGroupName: string;
  DescriptionFieldLabel: string;
}

declare module 'getUserProfilePropertiesStrings' {
  const strings: IGetUserProfilePropertiesStrings;
  export = strings;
}
