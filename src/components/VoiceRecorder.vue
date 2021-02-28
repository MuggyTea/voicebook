<template>
    <!-- <vue-record-audio @result="onResult" :mode="press" stream /> -->
    <div>
  <v-btn @click="startRecording" :loading="processing" :disabled="processing">録音開始</v-btn>
  <v-btn @click="stopRecording" :disabled="!processing">録音停止</v-btn>
  <ul id="output" v-if="preview"></ul>
  </div>
</template>

<script>
// import Recorder from "../plugins/recorder"
import lamejs from "linejs"
import WAV from 'wav-arraybuffer'

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
        mp3array: null,
        wavencoder: null,
        preview: 'on',
        processing: false
      }
    },
  methods: {
// 初期化
initRecording() {
  // 音声入力の取得
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({audio: true, video: false}).then(stream => {
      this.recorder = new MediaRecorder(stream);
      this.recorder.start();
      this.recorder.addEventListener('dataavailable', e => {
        // オーディオデータを格納
        this.audioData.push(e.data);
        this.audioExtension = this.getExtension(e.data.type);
        // this.recorder.stop()
        // ストップが押されたとき
        this.recorder.addEventListener('stop', () => {
          // mp3に変換の準備
          var channels = 1; //1 for mono or 2 for stereo
          var sampleRate = 44100; //44.1khz (normal mp3 samplerate)
          var kbps = 128; //encode 128kbps mp3
          var lamejs = require('lamejs')
          var mp3encoder = new lamejs.Mp3Encoder(channels, sampleRate, kbps);

          // samples = new Int16Array(44100); //one second of silence (get your data from the sourceyou have)
          // blobのe.dataをarraydataURLに変換する
          var fr = new FileReader()
          new Promise((resolve, reject) => {
            fr.onload = eve => {
              // String(fr.result).split('base64,')
              this.mp3array = new Int8Array(fr.result);
              // ArrayBufferをAudioBufferのArrayにへんかん
              var waveAudiobuffer = new WAV(this.mp3array)
              // wavファイルに変換。audiobuffer-to-wavというライブラリを使う
              // Requests and decodes an MP3 file
              // Encodes the audio data as WAV
              // Then triggers a download of the file
              var xhr = require('xhr')
              var audioBufferToWav = require('audiobuffer-to-wav')

              var context = new (window.AudioContext || window.webkitAudioContext)()
              var source = context.createBufferSource()
              var vm = this
              var RawArrayBuffer = fr.result
              context.decodeAudioData(fr.result, function(buffer) {
                // bufferはAudioBuffer
                // sourceはAudioBufferNode
                var waveencoder
                source.buffer = buffer;
                source.connect(context.destination);
                source.loop = true;
                // AudioBuffer to Wav
                waveencoder = audioBufferToWav(buffer)
                const audioBlob = new Blob([waveencoder], { 'type' : 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                var audiodatalist = {'audioBlob': audioBlob, 'url': url}
                var output = document.getElementById('output')
                // 録音が終わったらオーディオタグを表示する
                var au = document.createElement('audio')
                au.controls = true
                au.src = url
                au.setAttribute('type', 'audio/wav')
                au.id = 'audiodemo'
                output.appendChild(au)
                var br = document.createElement('br')
                vm.$emit('audioData', audioBlob, url, RawArrayBuffer, buffer, waveencoder)
                },

                function(e){ console.log("Error with decoding audio data" + e.err);
              })
              var mp3array_len = this.mp3array.length
            }
            fr.onerror = eve => {
              console.log(fr.error)
            }
          })
          var b = fr.readAsArrayBuffer(e.data)

        });
      });
    })
  } else {
  }
},
// 録音開始
startRecording() {
    // this.status = 'recording';
    const canvas_demo = window.document.getElementById('audiodemo')
    // 画面にcanvasが出ていたら消す
    if (canvas_demo){
      this.processing = false
      canvas_demo.remove()
    }
    this.processing = true
    this.initRecording()
    this.recorder.start()
    this.audioData = [];

},
// 録音停止
stopRecording() {
  this.status = 'ready';
  this.initRecording()
  this.recorder.stop()
  this.processing = false
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
    let extension = 'wav';
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
