setTimeout(() => {
  FirebasePlugin.getToken(
    function (fcmToken) {
      var fcm_token = fcmToken;

      //alert("1=" + fcm_token);

      //send this fcm_token to action=PushNotification, gcmid=fcm_token, type=ios

      FirebasePlugin.grantPermission((hasPermission) => {
        console.log("Permission was " + (hasPermission ? "granted" : "denied"));
      });
    },
    function (error) {
      console.error(error);
    }
  );
}, 3000);
