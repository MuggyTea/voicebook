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

export default {
    name:"VoiceRecorder",
    data () {
      return {
        status: 'ready',     // 状況
        recorder: null,     // 音声にアクセスする "MediaRecorder" のインスタンス
        audioData: [],      // 入力された音声データ
        audioExtension: '',  // 音声ファイルの拡張子
        output: null
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
          this.audioData.push(e.data);
          this.audioExtension = this.getExtension(e.data.type);
          console.log(this.audioData)
          console.log(this.audioExtension)

      });
    })
    this.recorder.addEventListener('stop', () => {
      console.log('止めるよ')
        const audioBlob = new Blob(this.audioData, { 'type' : 'audio/wav; codecs=0' });
        const url = URL.createObjectURL(audioBlob);
        console.log(audioBlob)
        console.log(url)
        var output = document.getElementById('output')
        // 録音が終わったらオーディオタグを表示する
        var au = document.createElement('audio')
        au.controls = true
        au.src = url
        output.appendChild(au)
        var br = document.createElement('br')
        output.appendChild(br)
        // LinkListFormにデータを渡す
        
    this.status = 'ready';

    });
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
