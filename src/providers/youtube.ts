import { Injectable } from "@angular/core";
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { Events } from "ionic-angular";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/scan';

@Injectable()
export class Youtube {

  private key = "key do youtube";
  public listVideos: any = [];
  public video: any = null;
  public index = 0;
  public timer: any;
  public dataDirectory = "";
  public count = 1;

  public youtube: any = {
    ready: false,
    player: null,
    playerId: null,
    videoId: null,
    videoTitle: null,
    playerHeight: '100%',
    playerWidth: '100%'
  }

  constructor(public http: Http, public events: Events) {

  }

  setupPlayer() {
    window['onYouTubeIframeAPIReady'] = () => {
      if (window['YT']) {
        this.youtube.ready = true;
        this.bindPlayer('placeholder');
        this.loadPlayer();
      }
    };

    if (window['YT'] && window['YT'].Player) {
      this.youtube.ready = true;
      this.bindPlayer('placeholder');
      this.loadPlayer();
    }
  }

  bindPlayer(elementId): void {
    this.youtube.playerId = elementId;
  };

  loadPlayer(): void {
    if (this.youtube.ready && this.youtube.playerId) {
      if (this.youtube.player) {

        this.youtube.player.destroy();
      }

      this.youtube.player = this.createPlayer();
    }
  }

  createPlayer() {
    this.video = this.listVideos[this.index];
    return new window['YT'].Player(this.youtube.playerId, {
      height: this.youtube.playerHeight,
      width: this.youtube.playerWidth,
      videoId: this.video.id.videoId,
      playerVars: {
        version: 3,
        autoplay: 1,
        playsinline: 1,
        controls: 0,
        showinfo: 0,
        disablekb: 1,
        enablejsapi: 1,
        fs: 0,
        modestbranding: 1,
        rel: 0,
        iv_load_policy: 3
      },
      events: {
        onReady: (event) => {
          this.onPlayerReady(event);
        },
        onStateChange: (event) => {
          this.onPlayerStateChange(event);
        },
        onError: (event) => {
          this.onPlayerError(event);
        }
      }
    });
  }

  onPlayerReady(event) {
    this.events.publish('youtube:onReady', event.target.getDuration());
    event.target.playVideo();
  }

  onPlayerError(event) {

    if ([2, 5, 100, 101, 150].indexOf(event.data) !== -1) {
      this.nextVideo();
    }
  }

  onPlayerStateChange(event) {
    this.events.publish('youtube:onPlayerStateChange', event.data);
    if (event.data == 0) {
      this.nextVideo();
    }
  }

  launchPlayer(): void {
    this.video = this.listVideos[this.index];

    this.youtube.player.loadVideoById(this.video.id.videoId);
    this.youtube.videoId = this.video.id.videoId;
    this.youtube.videoTitle = this.video.snippet.title
    return this.youtube;
  }

  previousVideo() {
    if (this.index == 0) {
      this.index = this.listVideos.length - 1;
    } else {
      this.index -= 1;
    }
    this.video = this.listVideos[this.index];
    this.launchPlayer();
  }

  nextVideo() {
    if (this.index < this.listVideos.length - 1) {
      this.index += 1;
    } else {
      this.index = 0;
    }

    this.video = this.listVideos[this.index];
    this.launchPlayer();
  }

  pause() {
    this.youtube.player.pauseVideo();
  }

  continue() {
    this.youtube.player.playVideo();
  }

  seekTo(value) {
    let duration = this.youtube.player.getDuration();
    let time = duration * value;
    this.youtube.player.seekTo(time, true);
  }


  getListChannels(pageToken): Observable<any> {
    if (typeof pageToken == 'undefined')
      return Observable.empty();

    let channelId = "id do canal"

    let url = "https://www.googleapis.com/youtube/v3/subscriptions/?part=contentDetails,snippet&channelId=" + channelId + "Q&maxResults=50&order=alphabetical&key=" + this.key + "&pageToken=" + pageToken;
    return this.http.get(url).map(data => {
      return data.json();
    });
  }

  getPlayListItem(pageToken, channelId): Observable<any> {
    if (typeof pageToken == 'undefined')
      return Observable.empty();

    let url = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=" + this.count + "&channelId=" + channelId + "&order=viewCount&type=video&key=" + this.key + "&pageToken=" + pageToken;


    return this.http.get(url).map(data => {
      if (this.count == 1) {
        this.count = 50;
      }
      return data.json();
    });
  }
}
