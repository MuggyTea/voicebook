<template>
    <div v-if="isLogin" class="card md-2 float-lg-left" style="width:320px">
      <v-card class="elevation-12">
        <div class="card-header text-left">
            <input type="text" class="form-control" placeholder="link_title" v-model.trim="link.link_title">
        </div>
        <div class="card-body text-left">
            <textarea class="form-control" placeholder="descriptioin" v-model.trim="link.description"></textarea>
        </div>
          <v-card-actions>
            <v-btn color="white" v-model.trim="link.voice_rec">
              <voice-recorder
                :voiceUrl="voiceUrl"
                :voiceBlob="voiceBlob"
                @audioData="emitEvent"
              ></voice-recorder>
            </v-btn>
          </v-card-actions>
          <v-card-actions>
            <v-spacer></v-spacer>
              <v-btn color="primary"
              label="Select Image"
              @click="pickFile"
              v-model="imageName"
              prepend-icon="attach_file"
              >
                アイキャッチ画像
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
          <output class="form__output" v-if="preview" width="300px" height="300px">
              <canvas id="canvas"></canvas>
          </output>
        <div class="card-footer text-right">
            <button class="btn-sm btn-secondary" type="submit" v-on:click.prevent="addLink">投稿</button>
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
      voiceStrageUrl: null
    }
  },
  methods: {
    emitEvent(voiceBlob, voiceUrl) {
      this.voiceBlob = voiceBlob
      this.voiceUrl = voiceUrl
      console.log(this.voiceBlob)
      console.log(this.voiceUrl)
    },
    addLink () {
      // if (!this.link.link_title && !this.link.description && !this.voiceUrl) {
      if (!this.voiceUrl) {
        console.log('何も入ってない')
        alert('音声を投稿してね')
        return
      }
      console.log('add new Link')
      console.log(new Date())
      //   console.log(this.emptyLink())
      this.link.platforms = []
      this.link.million = false
      this.link.createAt = new Date()
      this.link.userinfo = this.userinfo
      this.link.screenName = this.userinfo.screenName
      this.link.uid = this.userinfo.uid
      this.link.id_str = this.userinfo.id_str
      console.log(this.voiceBlob)
      console.log(this.voiceUrl)
      if (!this.voiceUrl) {
        console.log(this.link)
        console.log('音声なし')
        // // ステートを変更
        // this.$store.dispatch('links/addLink', this.link)
        // // 空に戻す
        // this.link = this.emptyLink()
        return
      }
      // 音声データを格納する
      // firestoreに画像を保存するストレージオブジェクト作成
      const storageRef = firebase.storage().ref()
      const mountainRef_voice = storageRef.child('voiceData/' + String(this.voiceUrl) + '.mp3')
      // Create file metadata including the content type
      var metadata_a = {
        contentType: 'audio/mp3',
      };
      // ファイルを適用してファイルアップロード
      mountainRef_voice.put(this.voiceBlob, metadata_a).then(snapshot => {
        snapshot.ref.getDownloadURL().then(downloadURL => {
        this.voiceStrageUrl = downloadURL
        console.log(this.voiceStrageUrl)
        this.link.voiceURL = downloadURL
        console.log(this.link)
        })
      })
      if (!this.imageName) {
        console.log(this.link)
        console.log('から')
        return
        // ステートを変更
        // this.$store.dispatch('links/addLink', this.link)
        // 空に戻す
        // this.link = this.emptyLink()
      }
      var blob = null // 画像blobデータ
      // // サムネ画像用canvasのサイズを上で算出した値に変更
      var canvas = document.getElementById("canvas")
      // canvasからbase64画像データを取得
      var base64_url = canvas.toDataURL('image/jpeg')
      console.log(base64_url)
      // base64からblobデータを作成
      var base64 = String(base64_url).split('base64,')
      var barr, bin , i, len
      console.log(typeof base64)
      console.log(base64)
      console.log(base64[1])
      // console.log(base64_s)
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
      console.log(blob)
      // this.imageURL = reader.result
      this.imageFile = blob
      console.log(this.imageFile)
      console.log(this.imageName)
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
        console.log(this.imageURL)
        this.link.photoURL = downloadURL
        console.log(this.link)
        // ステートを変更
        // this.$store.dispatch('links/addLink', this.link)
        // // 空に戻す
        // this.link = this.emptyLink()
        // this.preview = null
        })
      })
      // ステートを変更
      this.$store.dispatch('links/addLink', this.link)
      // 空に戻す
      this.link = this.emptyLink()
      this.preview = null
      console.log(this.imageFile)
      console.log(typeof this.imageFile)
      console.log(this.imageName)
      console.log(String(this.imageName))
      console.log(this.voiceStrageUrl)
    },
    emptyLink () {
      console.log('empty link')
      return CONSTANTS.NEW_EMPTY_MEMO()
    },
    pickFile () {
      this.$refs.image.click()
    },
    onFilePicked (event) {
      // フォームでファイルが選択されたら実行される
      console.log(event.target.files)
      if (event.target.files.length === 0) {
        console.log(event.target.files.length)
        this.reset()
        return false
      }
      // ファイルが画像でなかったら処理中断
      if (!event.target.files[0].type.match('image/*')) {
        console.log(event.target.files[0].type)
        this.reset()
        return false
      }
    var file = null; // 選択されるファイル
    var blob = null; // 画像(BLOBデータ)
    const THUMBNAIL_WIDTH = 300; // 画像リサイズ後の横の長さの最大値
    const THUMBNAIL_HEIGHT = 300; // 画像リサイズ後の縦の長さの最大値
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
        // サムネ描画用canvasのサイズを上で算出した値に変更
        var canvas = document.getElementById('canvas');
        // canvas.width = width
        // canvas.height = height
        var ctx = canvas.getContext('2d');
        // // canvasに既に描画されている画像をクリア
        // ctx.clearRect(0,0,width,height);
        // // canvasにサムネイルを描画
        // ctx.drawImage(image,0,0,image.width,image.height,0,0,width,height);
        ctx.drawImage(image,0,0,image.width);
      }
      // previewに読み込み結果（データURL）を代入する
      // previewに値が入ると<output>につけたv-ifがtrueと判定される
      // また、<output>内部の<img>のsrc属性はpreviewの値を参照しているので、結果として画像が表示される
      this.preview = e.target.result
      // this.canvas = e.target.result
      console.log(this.preview)
      this.imageName = event.target.files[0].name
      console.log(this.imageName)
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
          console.log(this.imageURL)
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
      console.log('new: %s, old: %s', JSON.stringify(n), JSON.stringify(o))
    }
  }
}
</script>
