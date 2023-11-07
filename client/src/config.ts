// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'ql9nd5ar41'
// export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-w3h5pxtsywo2ylbg.us.auth0.com',            // Auth0 domain
  clientId: 'FCryrNBbres3DAErOy3z3cGTldBIKiRE',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
