<template>
  <div class="link-list">
    <v-card>
      <v-container fluid grid-list-md>
        <v-layout row wrap>
          <!-- <h1>Index</h1> -->
          <div class="row justify-content-center">
            <!-- <PhotoUpload /> -->
            <link-list-form></link-list-form>
            <link-list-card v-for="(link, index) in alllinks" v-bind:key="index" v-bind:link="link"></link-list-card>
          </div>
        </v-layout>
      </v-container>
    </v-card>
    <!-- <div class="grid">
            <link-photo
                class="grid__item"
                v-for="link_list in link_lists"
                :key="link_list.user_id"
                :item="link_list"
            />
            <one-link></one-link>
    </div>-->
  </div>
</template>

<script>
// import LinkPhoto from '../components/LinkPhoto'
// import OneLink from '../components/OneLink'
import LinkListCard from '../components/LinkListCard'
import LinkListForm from '../components/LinkListForm'
// import AudioRecorder from '../components/AudioRecorder'
// import UserProfile from '../components/UserProfile'

export default {
  name: 'IndexList',
  components: {
    // 'link-photo': LinkPhoto,
    // 'one-link': OneLink,
    'link-list-card': LinkListCard,
    'link-list-form': LinkListForm,
    // 'audio-recorder': AudioRecorder
    // 'user-profile': UserProfile
  },
  data () {
    return {
    }
  },
  // pathの:idを直接書き換えた時の対応
  beforeRouteUpdate (to, from, next) {
    // 動的セグメントが変わった場合は、コールバック関数でtargetIdを更新する
    this.screen_name = to.params.screen_name
    // this.init()
    this.start()
    next()
  },
  mounted () {
    // this.init()
    this.start()
  },
  destroyed () {
    this.stop()
  },
  methods: {
    init () {
      this.$store.dispatch('links/clear')
    },
    start () {
      this.$store.dispatch('links/startListenerAll')
    },
    stop () {
      this.$store.dispatch('links/stopListener')
    },
    remove (id) {
      this.$store.dispatch('links/deleteLink', {id})
    }
  },
  // computedには結果がキャッシュされる
  // getterには引数は渡せない
  // ゲッター
  computed: {
    userinfo () {
      return this.$store.getters['auth/user']
    },
    isLogin () {
      return this.$store.getters['auth/check']
    },
    alllinks () {
      return this.$store.getters['links/alldata']
    }
  }
}
</script>
<style>
/* .link-list {
  margin: auto;
} */

.row__test__delete {
  margin: auto;
}
</style>
