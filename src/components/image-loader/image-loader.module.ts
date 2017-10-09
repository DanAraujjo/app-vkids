import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ImageLoader } from './image-loader';

@NgModule({
  declarations: [
    ImageLoader,
  ],
  imports: [
   IonicPageModule.forChild(ImageLoader),
  ],
  exports: [
    ImageLoader
  ]
})
export class ImageLoaderModule {}
