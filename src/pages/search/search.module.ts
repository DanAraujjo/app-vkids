import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SearchPage } from './search';
import { ImageLoaderModule } from "../../components/image-loader/image-loader.module";

@NgModule({
  declarations: [
    SearchPage,
  ],
  imports: [
    IonicPageModule.forChild(SearchPage),
    ImageLoaderModule
  ],
  exports: [
    SearchPage
  ]
})
export class SearchModule {}
