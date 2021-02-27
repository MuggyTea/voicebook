<template>
    <!-- <vue-record-audio @result="onResult" :mode="press" stream /> -->
    <div>
  <v-btn @click="startRecording" v-if="status=='ready'">録音開始</v-btn>
  <v-btn @click="stopRecording" v-if="status=='recording'">録音停止</v-btn>
  <ul id="output"></ul>
  </div>
</template>

<script>
// import Recorder from "../plugins/recorder"
import lamejs from "linejs"

export default {
    name:"VoiceRecorder",
    data () {
      return {
        status: 'ready',     // 状況
        recorder: null,     // 音声にアクセスする "MediaRecorder" のインスタンス
        audioData: [],      // 入力された音声データ
        audioExtension: '',  // 音声ファイルの拡張子
        output: null,
        mp3Data: [],
        mp3array: null
      }
    },
  methods: {
// 初期化
initRecording() {
  // 音声入力の取得
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log('録音するよ')
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(stream => {
      console.log('メディアストリーマー')
      this.recorder = new MediaRecorder(stream);
      console.log(this.recorder)
      this.recorder.start();
      this.recorder.addEventListener('dataavailable', e => {
        console.log('録音中だよ')
        // オーディオデータを格納
        this.audioData.push(e.data);
        this.audioExtension = this.getExtension(e.data.type);
        console.log(this.audioData)
        console.log(this.audioExtension)

        // ストップが押されたとき
        this.recorder.addEventListener('stop', () => {
          console.log('止めるよ')
          // mp3に変換の準備
          var channels = 2; //1 for mono or 2 for stereo
          var sampleRate = 44100; //44.1khz (normal mp3 samplerate)
          var kbps = 128; //encode 128kbps mp3
          var lamejs = require('lamejs')
          var mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);

          // samples = new Int16Array(44100); //one second of silence (get your data from the sourceyou have)
          console.log(this.audioData)
          console.log(typeof this.audioData)
          console.log(e.data)
          // blobのe.dataをarraydataURLに変換する
          var fr = new FileReader()
          new Promise((resolve, reject) => {
            fr.onload = eve => {
              console.log(fr.result)
              String(fr.result).split('base64,')
              this.mp3array = new Int16Array(fr.result);
              // var a = fr.readAsArrayBuffer(e.data[0])
              // console.log(a)
              console.log(b)
                //one second of silence (get your data from the sourceyou have)
              console.log(this.mp3array)
              console.log(typeof this.mp3array)
              // var sampleBlockSize = 10000; //can be anything but make it a multiple of 576 to make encoders life easier
              // for (var i = 0; i < new Int16Array(this.mp3array.bytelength).length; i += sampleBlockSize) {
              //   var sampleChunk = this.mp3array.subarray(i, i + sampleBlockSize);
              for (var i = 0; i < this.mp3array.bytelength;) {
                var sampleChunk = this.mp3array.subarray(i);
                var mp3buf = mp3encoder.encodeBuffer(sampleChunk);
                if (mp3buf.length > 0) {
                  this.mp3Data.push(mp3buf);
                }
              }
              mp3buf = mp3encoder.flush();   //finish writing mp3
              console.log(mp3buf)

              if (mp3buf.length > 0) {
                console.log(mp3buf)
              this.mp3Data.push(new Int8Array(mp3buf));
              }
              console.log(this.mp3Data)
              console.log(typeof mp3Data)
              // const audioBlob = new Blob(this.audioData, { 'type' : 'audio/wav' });
              var audioBlob = new Blob(this.mp3Data, { 'type' : 'audio/mp3' });
              const url = URL.createObjectURL(audioBlob);
              console.log(audioBlob)
              console.log(url)
              var output = document.getElementById('output')
              // 録音が終わったらオーディオタグを表示する
              var au = document.createElement('audio')
              au.controls = true
              au.src = url
              au.setAttribute('type', 'audio/mp3')
              output.appendChild(au)
              var br = document.createElement('br')
              output.appendChild(br)
              let a = document.createElement('a');
              a.href = url;
              a.download = Math.floor(Date.now() / 1000) + this.audioExtension;
              document.body.appendChild(a);
              a.click();
              // LinkListFormにデータを渡す
              this.$emit('audioData', audioBlob, url)
              this.status = 'ready';
            }
            fr.onerror = eve => {
              console.log(fr.error)
            }
          })
          var b = fr.readAsArrayBuffer(e.data)
          // var b = fr.readAsDataURL(e.data)
          console.log(this.mp3Data)

        });
      });
    })
  } else {
    console.log('マイクがおんにならないよ')
  }
},
// 録音開始
startRecording() {
    this.status = 'recording';
    this.initRecording()
    this.audioData = [];
    this.recorder.start();

},
// 録音停止
stopRecording() {
  this.status = 'ready';
  this.recorder.stop();
  this.initRecording()
},
// オーディオタグの追加
addAudioTag() {
  var output = null
  // WAVのエクスポート
  this.recorder && this.recorder.exportWAV(function(blob) {
    // オーディオタグの追加
    var url = URL.createObjectURL(blob)
    var au = document.createElement('audio')
    au.controls = true
    au.src = url
    output.appendChild(au)
    var br = document.createElement('br')
    output.appendChild(br)
  })
},
// 音声ファイルの拡張子を取得する
getExtension(audioType) {
  console.log(audioType)
    let extension = 'mp3';
    // const matches = audioType.match(/audio\/([^;]+)/);

    // if(matches) {
    //   console.log('マッチ')
    //   console.log(matches)
    //     extension = matches[1];

    // }

    return '.'+ extension;

}
// 音声認識
// audioRecognize() {
//   const audioContext
//   const recorder
//   // WAVのエクスポート
//   recorder && recorder.exportWAV(function(blob) {
//     let reader = new FileReader()
//     reader.onload = function() {
//       // 音声認識
//       let result = new Uint8Array(reader.result)
//       let data = {
//         "config": {
//           "encoding": "LINEAR16",
//           "sampleRateHertz": 48000, // エラーメッセージに応じて変更
//           "languageCode": "ja-JP",
//           "audio_channel_count": 2
//         },
//         "audio": {
//           "content": arrayBufferToBase64(result)
//         }
//       }
//       fetch('https://speech.googleapis.com/v1/speech:recognize?key=' + apiKey, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json; charset=utf-8'
//         },
//         body: JSON.stringify(data)
//       }).then(function (response) {
//         return response.text()
//       }).then(function (text) {
//         let result_json = JSON.parse(text)
//         // 音声認識結果の表示
//         text = result_json.results[0].alternatives[0].transcript
//         output.innerHTML += "\n" + text
//         console.log("result: " + text)
//       })
//     }
//     reader.readAsArrayBuffer(blob)
//   })
// },
// ArrayBuffer → Base64
// arrayBufferToBase64(buffer) {
//   var audioContext
//   var recorder
//   let binary = ''
//   let bytes = new Float32Array(buffer)
//   let len = bytes.byteLength
//   for (let i = 0; i < len; i++) {
//     binary += String.fromCharCode(bytes[i])
//   }
//   return window.btoa(binary)
//       callback (msg) {
//           console.log("Event: ", msg)
//       },
//     onResult (data) {
//       console.log('The blob data:', data);
//       console.log('Downloadable audio', window.URL.createObjectURL(data));
//     }
//   },
  // mounted() {
  //   this.initRecording()
  // },
}
}
</script>
