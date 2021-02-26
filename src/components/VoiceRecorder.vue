<template>
    <!-- <vue-record-audio @result="onResult" :mode="press" stream /> -->
    <div>
  <v-btn @click="startRecording">録音開始</v-btn>
  <v-btn @click="stopRecording">録音停止</v-btn>
  <ul id="output"></ul>
  </div>
</template>

<script>
// import Recorder from "../plugins/recorder"

export default {
    name:"VoiceRecorder",
  methods: {
// 初期化 
initRecording() {
  var audioContext
  var recorder
  // オーディオコンテキストの初期化
  audioContext = new (window.AudioContext || window.webkitAudioContext)()

  // 音声入力の取得
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({audio: true}).then((stream) => {
      // レコーダーの生成
      var input = audioContext.createMediaStreamSource(stream)
      audioContext.resume()
      // recorder = new Recorder(input) 
    })
  }
},
// 録音開始
startRecording(button) {
  var audioContext
  var recorder
  this.initRecording()
  recorder && recorder.record()
},
// 録音停止
stopRecording(button) {
  var audioContext
  var recorder
  recorder && recorder.stop()
   
  // 音声認識
  // audioRecognize()
   
   this.addAudioTag()
  // レコーダーのクリア
  recorder.clear()
},
// オーディオタグの追加
addAudioTag() {
  // WAVのエクスポート
  var recorder
  var output
  recorder && recorder.exportWAV(function(blob) {
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
arrayBufferToBase64(buffer) {
  var audioContext
  var recorder
  let binary = ''
  let bytes = new Float32Array(buffer)
  let len = bytes.byteLength
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return window.btoa(binary)
},
      callback (msg) {
          console.log("Event: ", msg)
      },
    onResult (data) {
      console.log('The blob data:', data);
      console.log('Downloadable audio', window.URL.createObjectURL(data));
    }
  }
}
</script>
