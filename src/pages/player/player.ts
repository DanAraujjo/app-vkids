import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, Events, MenuController } from 'ionic-angular';
import { Youtube } from "../../providers/youtube";

@IonicPage()
@Component({
  selector: 'page-player',
  templateUrl: 'player.html',
})
export class PlayerPage {

  private loadItens: boolean = false;
  private channelId;
  private currentTimeVideo;
  private durationVideo;
  private rangeMax;
  private rangeVal;
  private stateVideo = 0;
  private showFooter = true;
  start: any = 0;
  title = "";
  clickedBack = false;
  online = true;
  public listVideos: any = [];
  searchQuery: string = '';

  constructor(
    public nav: NavController,
    public navParams: NavParams,
    private platform: Platform,
    private ytPlayer: Youtube,
    private events: Events,
    public menuCtrl: MenuController) {

    this.platform.ready().then(() => {
      document.addEventListener('resume', () => {
        try {
          this.showFooter = true;
          this.ytPlayer.continue();
        } catch (err) {
          //ignore
        }
      });

      document.addEventListener('pause', () => {
        try {
          this.showFooter = true;
          this.ytPlayer.pause();
        } catch (err) {
          //ignore
        }
      });

      this.events.subscribe('network:online', state => {
        this.online = state
      });

      //pegar os valores enviados pela HomePage
      this.channelId = this.navParams.get('channel').snippet.resourceId.channelId;

      //zera o sidemenu
      this.listVideos = [];
      this.ytPlayer.listVideos = [];
      this.events.publish('sideMenu:load', this.ytPlayer.listVideos);

      //default  values
      this.loadItens = false;
      this.rangeMax = 0;
      this.rangeVal = 0;
      this.durationVideo = this.toHHMMSS(0);
      this.currentTimeVideo = this.toHHMMSS(0);
      this.clickedBack = false;

      //evento para troca de video
      this.events.subscribe('playThis:changeVideo', id => {
        this.playVideo(id);
      });

      this.events.subscribe('youtube:onPlayerStateChange', data => {
        this.stateVideo = data;
      });

      //cria o player
      this.createYouTubePlayer();
      this.getVideosApi();

      //tempo corrente do video
      setInterval(() => {
        let seconds = 0;
        let duration = 0;

        try {
          duration = this.ytPlayer.youtube.player.getDuration();
          seconds = this.ytPlayer.youtube.player.getCurrentTime();
        } catch (err) {
          //ignore
        }

        this.rangeVal = seconds;
        this.rangeMax = duration;
        this.currentTimeVideo = this.toHHMMSS(seconds);
        this.durationVideo = this.toHHMMSS(duration);
      }, 1000);

    });
  }

  toHHMMSS(secs) {
    var sec_num = parseInt(secs, 10)
    var hours = Math.floor(sec_num / 3600) % 24
    var minutes = Math.floor(sec_num / 60) % 60
    var seconds = sec_num % 60
    return [hours, minutes, seconds]
      .map(v => v < 10 ? "0" + v : v)
      .filter((v, i) => v !== "00" || i > 0)
      .join(":")
  }

  //busca a lista de videos na api
  getVideosApi() {
    this.ytPlayer.count = 1;
    this.ytPlayer.getPlayListItem("", this.channelId)
      .expand(data => this.ytPlayer.getPlayListItem(data.nextPageToken, this.channelId), 1)
      .pluck("items")
      .subscribe((data: [any]) => {
        this.ytPlayer.listVideos = this.ytPlayer.listVideos.concat(data);

        if (this.ytPlayer.video == null) {
          this.playVideo(0);
        }

      }, err => console.error(err),
      () => {
        //carrega o sidemenu
        this.events.publish('menuVideo:load', this.ytPlayer.listVideos);
        this.listVideos = this.ytPlayer.listVideos;

        //ativa o botao do sidemenu
        if (this.ytPlayer.listVideos.length > 0) {
          this.loadItens = true;
        }
      });
  }

  //cria o objeto player youtube
  createYouTubePlayer() {
    //cria o player do youtube
    var tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    this.ytPlayer.video = null;
  }

  playVideo(index) {
    this.rangeVal = 0;
    this.rangeMax = 0;
    this.currentTimeVideo = this.toHHMMSS(0);
    this.durationVideo = this.toHHMMSS(0);

    this.showFooter = true;

    try {
      this.ytPlayer.index = index;
      this.title = this.ytPlayer.listVideos[index].snippet.title;

      this.ytPlayer.setupPlayer();

      //temporizador para esconder o footer
      this.sleep(8000)
        .then(() => {
          if (this.showFooter && this.stateVideo == 1) {
            this.showFooter = false;
          }
        })
    } catch (err) {
      //ignore
    }
  }

  clickPlayPause() {
    try {
      if (this.stateVideo == 1) {
        this.ytPlayer.pause();
        this.showFooter = true;
      }
      else {
        this.ytPlayer.continue();
      }
    } catch (err) {
      //ignore
    }
  }

  continue() {
    try {
      if (this.stateVideo != 1) {
        this.ytPlayer.continue();
      } else {
        this.showFooter = !this.showFooter;
      }
    } catch (err) {
      //ignore
    }
  }

  //avança ou retrocede no video
  seekTo(event) {
    try {
      this.ytPlayer.youtube.player.seekTo(event.value, true);
    } catch (err) {
      //ignore
    }
  }

  //ação ao clicar no botão home
  goBack() {
    if (!this.clickedBack) {
      this.clickedBack = true;
      this.nav.popToRoot().catch(() => { });
    }
  }

  //temporizadores
  sleep(seconds) {
    return new Promise(resolve => setTimeout(resolve, seconds));
  }

  openMenu() {
    if (!this.loadItens) {
      return
    }

    this.menuCtrl.swipeEnable(false);
    this.menuCtrl.open("menu2");
  }

  previousVideo() {

    try {
      let index = this.ytPlayer.index;

      if (index == 0) {
        index = this.ytPlayer.listVideos.length - 1;
      } else {
        index -= 1;
      }

      this.playVideo(index);

    } catch (err) {
      //ignore
    }
  }

  nextVideo() {
    console.log("aqui");

    try {
      let index = this.ytPlayer.index;

      if (index < this.ytPlayer.listVideos.length - 1) {
        index += 1;
      } else {
        index = 0;
      }

      this.playVideo(index);
    } catch (err) {
      //ignore
    }
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.listVideos = this.ytPlayer.listVideos;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.listVideos = this.listVideos.filter((item) => {
        return (item.snippet.title.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}