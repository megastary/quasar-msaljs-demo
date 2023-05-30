// Source AzureAD sample https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/samples/msal-browser-samples/vue3-sample-app/src/utils/UserInfo.ts
export interface UserInfo {
  businessPhones?: Array<string>;
  displayName?: string;
  givenName?: string;
  id?: string;
  jobTitle?: string;
  mail?: string;
  mobilePhone?: string;
  officeLocation?: string;
  preferredLanguage?: string;
  surname?: string;
  userPrincipalName?: string;
}

export interface UserPhoto {
  base64Image?: string;
}
