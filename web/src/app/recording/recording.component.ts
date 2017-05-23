import { Component } from '@angular/core';

@Component({
  selector: 'recording',
  templateUrl: './recording.component.html'
})

export class RecordingComponent {
  constructor() { }

  startRecording() {
    console.log("startRecording function in recording.html");
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ audio: true }).then((mediaStream) => {
        this.stuff(mediaStream);
      });
    }
  }

  showAudio(url) {
    var div = document.createElement('div');
    div.style.border = '1px solid';

    var audio = document.createElement('video');
    audio.controls = true;
    audio.src = url;
    div.appendChild(audio);

    var link = document.createElement('a');
    link.download = 'recording.ogg';
    link.href = url;
    link.innerHTML = 'download';
    div.appendChild(link);

    document.body.appendChild(div);
  }

  downloadBlob(url) {
    return new Promise((resolve, reject) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.responseType = 'blob';

      xhr.onload = function () {
        resolve(xhr.response);
      };

      xhr.send();
    });
  }

  stuff(mediaStream) {
    console.log(mediaStream);

    var recorder = new VorbisMediaRecorder(mediaStream, { audioBitsPerSecond: 32000 });

    console.log(recorder);

    var chunks = [];

    recorder.ondataavailable = (ev) => {
      console.log(ev.data);
      chunks.push(ev.data);
    };

    recorder.onstart = () => {
      console.log('start');
    };

    recorder.onstop = () => {
      console.log('stop');
      var blob = new Blob(chunks, { type: chunks[0].type });
      chunks = [];
      var url = URL.createObjectURL(blob);

      this.downloadBlob(url).then(blob => {
        this.showAudio(URL.createObjectURL(blob));
      });
    };

    var button = document.createElement('button');
    button.innerHTML = 'start';
    button.onclick = () => {
      if (recorder.state === 'recording') {
        recorder.stop();
        button.innerHTML = 'start';
      } else {
        recorder.start();
        button.innerHTML = 'stop';
      }
    };
    document.body.appendChild(button);
  }
}