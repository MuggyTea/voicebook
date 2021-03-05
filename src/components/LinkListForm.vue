<template>
    <div class="card md-2 float-lg-left" style="width:320px">
      <v-card class="elevation-12">
        <div class="card-header text-left">
            <input type="text" class="form-control" placeholder="タイトル(必須)" v-model.trim="link.link_title">
        </div>
        <div class="card-body text-left">
            <textarea class="form-control" placeholder="説明(任意)" v-model.trim="link.description"></textarea>
        </div>
          <v-card-actions>
            <voice-recorder
              :voiceUrl="voiceUrl"
              :voiceBlob="voiceBlob"
              :voiceRawBufferArry="voiceRawBufferArry"
              :voiceRawAudioBuffer="voiceRawAudioBuffer"
              :voiceBufferArrayWav="voiceBufferArrayWav"
              @audioData="emitEvent"
            ></voice-recorder>
          </v-card-actions>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="primary"
              label="Select Image"
              @click="pickFile"
              v-model="imageName"
              prepend-icon="attach_file"
              >
                アイキャッチ画像をつける
                <input
                type="file"
                style="display: none"
                ref="image"
                accept="image/*"
                @change="onFilePicked"
                />
              </v-btn>
          </v-card-actions>
          <!-- サムネイル表示領域 -->
          <output class="form__output" v-if="preview">
              <canvas id="canvas" width="320px" height="320px"></canvas>
          </output>
        <div class="card-footer text-right">
            <v-btn dark
              class="btn-sm btn-secondary"
              type="submit"
              v-if="!processing"
              v-on:click.prevent="addLink"
              :loading="processing"
              :disabled="processing"
            >投稿</v-btn>
            <v-btn
              class="btn-sm btn-secondary"
              type="submit"
              v-if="processing"
              :loading="processing"
              :disabled="!processing"
            >投稿しています</v-btn>
        </div>
        </v-card>
    </div>
</template>
<script>
import CONSTANTS from './constants'
// import PhotoUpload from './PhotoUpload'
import firestore from '../plugins/firebase'
import firebase from 'firebase'
import VoiceRecorder from '../components/VoiceRecorder'
// import firestore from '../plugins/firebase'

export default {
  name: 'LinkListForm',
  components: {
    'voice-recorder': VoiceRecorder
    // PhotoUpload
  },
  data () {
    return {
      link: this.emptyLink(),
      showForm: false,
      preview: null,
      photo: null,
      photo_url: null,
      dialog: false,
      imageName: null,
      imageURL: null,
      imageFile: null,
      voiceBlob: null,
      voiceUrl: null,
      voiceStrageUrl: null,
      processing: false,
      voiceRawBufferArry: null,
      voiceRawAudioBuffer: null,
      voiceBufferArrayWav: null
    }
  },
  methods: {
    emitEvent(voiceBlob, voiceUrl, voiceRawBufferArry, voiceRawAudioBuffer, voiceBufferArrayWav) {
      this.voiceBlob = voiceBlob
      this.voiceUrl = voiceUrl
      this.voiceRawBufferArry=voiceRawBufferArry
      this.voiceRawAudioBuffer=voiceRawAudioBuffer
      this.voiceBufferArrayWav=voiceBufferArrayWav
    },
    addLink () {
      this.processing = true
      // if (!this.link.link_title && !this.link.description && !this.voiceUrl) {
      if(!this.isLogin){
        this.processing = null
        alert('ログインして投稿してね')
        return
      }
      if (!this.voiceUrl || !this.link.link_title) {
        this.processing = null
        alert('タイトルと音声を投稿してね')
        return
      }
      this.link.platforms = []
      this.link.million = false
      this.link.createAt = new Date()
      this.link.userinfo = this.userinfo
      this.link.screenName = this.userinfo.screenName
      this.link.uid = this.userinfo.uid
      this.link.id_str = this.userinfo.id_str
      if (!this.voiceUrl) {
        // // ステートを変更
        // this.$store.dispatch('links/addLink', this.link)
        // // 空に戻す
        // this.link = this.emptyLink()
        return
      }

      // DB登録の準備
      // firestoreに画像を保存するストレージオブジェクト作成
      const storageRef = firebase.storage().ref()
      // アイキャッチデータをアップロードする
      if (!this.imageName) {
        this.link.photoURL = 'https://firebasestorage.googleapis.com/v0/b/voicebook-f2d88.appspot.com/o/defalutImage%2Fcat-5496162_640.jpg?alt=media&token=890df79f-3236-48e3-83c4-8b31d08b8cdd'
        // ステートを変更
        // this.$store.dispatch('links/addLink', this.link)
        // 空に戻す
        // this.link = this.emptyLink()
      } else {
      var blob = null // 画像blobデータ
      // // サムネ画像用canvasのサイズを上で算出した値に変更
      var canvas = document.getElementById("canvas")
      // canvasからbase64画像データを取得
      var base64_url = canvas.toDataURL('image/jpeg')
      // base64からblobデータを作成
      var base64 = String(base64_url).split('base64,')
      var barr, bin , i, len
      bin = atob(btoa(base64[1]))
      bin = atob(base64[1])
      len = bin.length
      barr = new Uint8Array(len)
      i = 0
      while (i < len) {
        barr[i] = bin.charCodeAt(i)
        i++
      }
      blob = new Blob([barr], {type: 'image/jpeg'})
      // this.imageURL = reader.result
      this.imageFile = blob
      // Create file metadata including the content type
      var metadata = {
        contentType: 'image/jpeg',
      };
      // ファイルパス設定
      // eslint-disable-next-line no-template-curly-in-string
      const mountainRef = storageRef.child('linkEyeCatchImage/' + this.imageName + '.jpeg')
      // ファイルを適用してファイルアップロード
      mountainRef.put(this.imageFile, metadata).then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
        this.imageURL = downloadURL
        this.link.photoURL = downloadURL
        })
      })
      }

      // 音声データをアップロードする
      const mountainRef_voice = storageRef.child('voiceData/' + String(this.voiceUrl) + '.wav')
      // Create file metadata including the content type
      var metadata_a = {
        contentType: 'audio/wav',
      };
      // ファイルを適用してファイルアップロード
      mountainRef_voice.put(this.voiceBlob, metadata_a).then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
        this.voiceStrageUrl = downloadURL
        this.link.voiceURL = downloadURL
        // this.link.voiceRawBufferArry=this.voiceRawBufferArry
        // this.link.voiceRawAudioBuffer=this.voiceRawAudioBuffer
        // this.link.voiceBufferArrayWav = this.voiceBufferArrayWav
        this.link.voiceURLs = { downloadURL : downloadURL }
        // this.link.voiceData = {
        //   'voiceURL': downloadURL,
        //   // 'voiceRawBufferArry': this.voiceRawBufferArry,
        //   // 'voiceRawAudioBuffer': this.voiceRawAudioBuffer,
        //   // 'voiceBufferArrayWav': this.voiceBufferArrayWav,
        // }
        // ステートを変更
        this.$store.dispatch('links/addLink', this.link)
        // 空に戻す
        this.link = this.emptyLink()
        this.preview = null
        this.processing = null
        const canvas_demo = window.document.getElementById('audiodemo')
        canvas_demo.remove()
        })
      })
      // 空に戻す
      // this.link = this.emptyLink()
      // this.preview = null
    },
    emptyLink () {
      return CONSTANTS.NEW_EMPTY_MEMO()
    },
    pickFile () {
      this.$refs.image.click()
    },
    onFilePicked (event) {
      this.preview = null
      // フォームでファイルが選択されたら実行される
      if (event.target.files.length === 0) {
        this.reset()
        return false
      }
      // ファイルが画像でなかったら処理中断
      if (!event.target.files[0].type.match('image/*')) {
        this.reset()
        return false
      }
    var file = null; // 選択されるファイル
    var blob = null; // 画像(BLOBデータ)
    const THUMBNAIL_WIDTH = 320; // 画像リサイズ後の横の長さの最大値
    const THUMBNAIL_HEIGHT = 320; // 画像リサイズ後の縦の長さの最大値
    // 画像をリサイズする
    var image = new Image();
    var reader = new FileReader();
    reader.onload = e => {
      image.onload = function() {
        var width, height;
        if(image.width > image.height){
          // 横長の画像は横のサイズを指定値にあわせる
          var ratio_w = image.height/image.width;
          width = THUMBNAIL_WIDTH;
          height = THUMBNAIL_WIDTH * ratio_w;
        } else {
          // 縦長の画像は縦のサイズを指定値にあわせる
          var ratio_h = image.width/image.height;
          width = THUMBNAIL_HEIGHT * ratio_h;
          height = THUMBNAIL_HEIGHT;
        }
        // width = THUMBNAIL_WIDTH;
        // height = THUMBNAIL_WIDTH;
        // サムネ描画用canvasのサイズを上で算出した値に変更
        var canvas = document.getElementById('canvas');
        // canvas.width = width
        // canvas.height = height
        var ctx = canvas.getContext('2d');
        // // canvasに既に描画されている画像をクリア
        // ctx.clearRect(0,0,width,height);
        // // canvasにサムネイルを描画
        // ctx.drawImage(image,0,0,image.width,image.height,0,0,width,height);
        ctx.drawImage(image,0,0, image.width, image.height, 0, 0, width, height);
      }
      // previewに読み込み結果（データURL）を代入する
      // previewに値が入ると<output>につけたv-ifがtrueと判定される
      // また、<output>内部の<img>のsrc属性はpreviewの値を参照しているので、結果として画像が表示される
      this.preview = e.target.result
      // this.canvas = e.target.result
      this.imageName = event.target.files[0].name
      image.src = e.target.result;
    }
    // ファイルを読み込む
    // 読み込まれたファイルはデータURL形式で受け取れる（上記onload参照）
    reader.readAsDataURL(event.target.files[0])
    },
    reset () {
      this.preview = ''
      this.$el.querySelector('input[type="file]').value = null
    },
    // 画像アップロード処理
    uploadPhoto () {
      // ストレージオブジェクト作成
      const storageRef = firebase.storage().ref()
      // ファイルパス設定
      // eslint-disable-next-line no-template-curly-in-string
      const mountainRef = storageRef.child('linkEyeCatchImage/' + this.imageFile.name)
      // ファイルを適用してファイルアップロード
      mountainRef.put(this.imageFile).then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
          this.imageURL = downloadURL
          this.link.photoURL = downloadURL
          // firestore.collection('LinkPage').add({
          //   'photoURL': downloadURL
          // })
        })
      })
    }
  },
  computed: {
    isLogin () {
      return this.$store.getters['auth/check']
    },
    userinfo () {
      return this.$store.getters['auth/user']
    }
  },
  watch: {
    'link' (n, o) {
    }
  }
}
</script>
