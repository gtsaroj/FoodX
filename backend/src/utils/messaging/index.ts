import * as OneSignal from "@onesignal/node-onesignal";

const configuration = OneSignal.createConfiguration({
  authMethods: {
    rest_api_key: {
      tokenProvider: {
        getToken: () => process.env.ONESIGNAL_AUTH_KEY || "",
      },
    },
  },
});

export const oneSignalClient = new OneSignal.DefaultApi(configuration);
