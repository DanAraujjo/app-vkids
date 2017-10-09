import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { PlayerPage } from "../player/player";

@IonicPage()
@Component({
  selector: 'page-search',
  templateUrl: 'search.html',
})
export class SearchPage {

  searchQuery: string = '';
  public items: any[];
  public listChannels: any[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private platform: Platform) {
    this.platform.ready().then(() => {
      this.items = [];
      this.listChannels = this.navParams.get('listChannels');
      this.initializeItems();
    });
  }


  initializeItems() {
    this.items = this.listChannels;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.snippet.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  goPlayer(channel) {
    this.navCtrl.push(PlayerPage, { channel: channel });
  }
}
