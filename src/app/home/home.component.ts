import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { TNSPlayer } from 'nativescript-audio-player';
import { isIOS,isAndroid } from 'tns-core-modules/platform';

@Component({
  selector: 'ns-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  moduleId: module.id,
})
export class HomeComponent implements OnInit, OnDestroy{


    @ViewChild('sw') ngSlider: ElementRef;
  player : TNSPlayer;

  loading = true;
  isPlaying = false;
  tapped = false;

  progress = 0;
  checkInterval;

  audioDuration;

  constructor() {
      this.player = new TNSPlayer();
  }

  ngOnInit() {

    const playerOptions = {
        audioFile: 'https://mp3download.center/get-file?vid=nhT_6Yz-Nbc&quality=320&title=Miranda%20Cosgrove%20-%20Kissin%20U',
        loop: false,
        autoplay: false,
      };

      this.player.initFromUrl(playerOptions).then((res)=>{
        this.loading = false;

    }).catch((err) => {
      });

      this.checkInterval = setInterval(() => {
        this.player.getAudioTrackDuration().then((duration:any) => {
          // iOS: duration is in seconds
          // Android: duration is in milliseconds
          let current = this.player.currentTime
          if (isIOS) {
            duration *= 1000
            current *= 1000
          }

          this.progress = Math.ceil(current / 1000);
        //   console.log("progress  = "+ this.progress );
          this.ngSlider.nativeElement.set('maxValue',Math.ceil(duration/1000));

        });
      }, 200);


  }


  onTapSlider(){
    this.tapped = true;
  }

  onSliderValueChange(event) {
      if(this.tapped){
        this.player.seekTo(event.value*1000);
      }
      this.tapped = false;
  }

  playAudio() {
    if (this.player.isAudioPlaying()) {
        this.player.pause();
        this.isPlaying = false;
    }else{
        this.player.play();
        this.isPlaying = true;
    }
  }


  ngOnDestroy() {
    clearInterval(this.checkInterval);
  }

}
