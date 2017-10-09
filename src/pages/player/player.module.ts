import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PlayerPage } from './player';
import { ImageLoaderModule } from "../../components/image-loader/image-loader.module";

@NgModule({
  declarations: [
    PlayerPage,
  ],
  imports: [
    IonicPageModule.forChild(PlayerPage),
    ImageLoaderModule
  ],
  exports: [
    PlayerPage
  ]
})
export class PlayerModule { }
