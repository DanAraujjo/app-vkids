import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Firebase } from "@ionic-native/firebase";
import { Youtube } from "../providers/youtube";
import { HttpModule } from '@angular/http';
import { PlayerModule } from "../pages/player/player.module";
import { SearchModule } from "../pages/search/search.module";
import { Network } from "@ionic-native/network";
import { ImageLoaderModule } from "../components/image-loader/image-loader.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; //npm install --save @angular/animations@latest
import { Toast } from "@ionic-native/toast";
import { SortPipe } from "../components/sort-pipe/sort-pipe";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    SortPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    PlayerModule,
    SearchModule,
    ImageLoaderModule,
    BrowserAnimationsModule,    
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Firebase,
    Youtube,
    Network,
    Toast,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})






export class AppModule { }

