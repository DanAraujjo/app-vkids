import { Component } from '@angular/core';
import { NavController, LoadingController, Platform, Events, ToastController } from 'ionic-angular';
import { Youtube } from "../../providers/youtube";
import { Firebase } from "@ionic-native/firebase";
import { PlayerPage } from "../player/player";
import { SearchPage } from "../search/search";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})


export class HomePage {
  loader: any;
  listChannels: any = [];
  reload = false;
  updateDb = false;
  online = true;

  constructor(
    private platform: Platform,
    public navCtrl: NavController,
    private loadingCtrl: LoadingController,
    private events: Events,
    private nav: NavController,
    public ytPlayer: Youtube,
    public toastCtrl: ToastController,
    public firebase: Firebase) {
    this.platform.ready().then(() => {
      this.online = true;

      this.presentLoading();
      this.getChannelsApi();

      this.events.subscribe('network:online', state => {
        this.online = state
      });
    })
  }

  getChannelsApi() {
    try {
      this.ytPlayer.getListChannels("")
        .expand(data => this.ytPlayer.getListChannels(data.nextPageToken), 1)
        .pluck("items")
        .subscribe((data: [any]) => {
          this.listChannels = this.listChannels.concat(data);
        }, err => console.error(err),
        () => {
          this.loader.dismiss().catch(() => { });
        });

    } catch (err) {
      let toast = this.toastCtrl.create({
        message: 'Ocorreu um erro ao atualizar a lista de canais...',
        duration: 3000
      });
      toast.present();
      this.getChannelsApi();
    }
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Aguarde..."
    });
    this.loader.present();
  }

  //Carrega os videos do canal selecionado
  goPlayer(channel) {
    this.firebase.logEvent("channel_selected", { content_type: "channel_open", item_id: channel.snippet.title }).catch(err => console.log(err));
    this.nav.push(PlayerPage, { channel: channel });
  }

  goSearch() {
    this.nav.push(SearchPage, { listChannels: this.listChannels });
  }
}