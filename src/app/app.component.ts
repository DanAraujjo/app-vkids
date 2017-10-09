import { Component, ViewChild } from '@angular/core';
import { Platform, Events, MenuController, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Firebase } from '@ionic-native/firebase';
import { HomePage } from '../pages/home/home';
import { Network } from "@ionic-native/network";
import { Toast } from '@ionic-native/toast';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  //rootPage: any = HomePage;
  @ViewChild('nav') nav: Nav;

  showOff: boolean = false;

  public listVideos: any = [];

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private events: Events,
    private menuCtrl: MenuController,
    private firebase: Firebase,
    private network: Network,
    private toast: Toast) {

    platform.ready().then(() => {
      splashScreen.hide();
      statusBar.hide();

        this.events.subscribe('menuVideo:load', listVideos => {
        this.listVideos = listVideos;
      });

      this.network.onConnect().subscribe(() => {
        //this.toast.dismiss().then(() => this.showOff = false).catch(() => { });
        this.events.publish('network:online', true);
        this.toast.hide().catch(() => { });
      });

      this.network.onDisconnect().subscribe(() => {
        this.events.publish('network:online', false);
        this.toast.showWithOptions({
          message: 'Oops!! Você parece estar off-line!',
          duration: 4000,
          position: 'bottom',
          styling: {
            backgroundColor: 'red',
            textColor: 'white',
          }
        }).subscribe(() => { })

        /*  if (!this.showOff) {
                  
                  this.toast = this.toastCtrl.create({
                    message: 'Oops!! Você parece estar off-line! :(',
                    position: 'bottom',
                    showCloseButton: true,
                    closeButtonText: "OK"
                  });
                  this.toast.present().then(() => this.showOff = true)
                  
               }
               */
      });

      //abort event back button
      this.platform.registerBackButtonAction((event) => {
        this.toast.show("Botão bloqueado!", "short", "bottom").subscribe(() => { });
      }, 999);

      this.listVideos = [];
      this.menuCtrl.swipeEnable(false);

      this.initPushNotification();
      this.nav.setRoot(HomePage);
    });
  }

  initPushNotification() {
    if (!this.platform.is("cordova")) { return }

    this.firebase.getToken()
      .then(token => console.log(`The token is ${token}`)) // save the token server-side and use it to push notifications to this device
      .catch(error => console.error('Error getting token', error));

    this.firebase.onNotificationOpen().subscribe((data) => console.log(data));
  }

  playVideo(id) {
    this.events.publish('playThis:changeVideo', id);
  }
}

