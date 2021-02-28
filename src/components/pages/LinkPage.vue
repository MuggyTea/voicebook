<template>
  <div class="pade__details container-fluent">
    <div class="col">
      <v-card-title class="name align-end justify-center fill-height">
        <v-btn color="black" text
        :to="{ name: 'LinkList', params: {screen_name: link.screenName }}"
        >
        <v-avatar
          color="grey lighten-4"
          >
          <img
          v-if="link.userinfo.photoURL"
          :src="link.userinfo.photoURL"
          alt="profile"
          >
        </v-avatar>
        {{ link.userinfo.displayName }}さんのユーザーページに飛ぶ
        </v-btn>
      </v-card-title>
      <div class="card" v-if="link.id">
        <h5 class="card-title">{{ link.link_title }}</h5>
      </div>
      <v-img
        :src="link.photoURL"
        width="400px"
        center
      >
      </v-img>
      <audio controls :src="formatedAudio" type="audio/wav"></audio>
      <div class="card-body text-left">
        <p class="card-text" v-html="formatedDescription" />
        <hr class="mb-3" />
        <small>{{ formatedReleasedAt }}</small>
      </div>
      <div class="card-footer text-right">
        <button class="btn btn-primary" v-on:click="historyBack">back</button>
      </div>
    </div>
  </div>
</template>

<script>
import CONSTANS from '../constants/'
export default {
  name: 'LinkDetailPage',
  data: function () {
    return {
      // 監視対象のidをdataプロパティにtargetIdとして定義
      // targetIdはpropsのidで更新する
      targetId: this.link_id
    }
  },
  // routeの動的セグメント
  props: [
    'link_id',
    'id',
    'screen_name'
  ],
  // pathの:idを直接書き換えた時の対応
  beforeRouteUpdate (to, from, next) {
    // 動的セグメントが変わった場合は、コールバック関数でtargetIdを更新する
    this.targetId = to.params.id
    next()
  },
  mounted () {
    this.init()
    this.start()
  },
  destroyed () {
    this.stop()
  },
  methods: {
    init () {
      this.$store.dispatch('link/clear')
    },
    start () {
      this.$store.dispatch('link/startListener', {link_id: this.targetId})
    },
    stop () {
      this.$store.dispatch('link/stopListener')
    },
    historyBack () {
      this.$router.back()
    }
  },
  computed: {
    userinfo () {
      return this.$store.getters['auth/user']
    },
    link () {
      if (!this.targetId) {
        console.error('invalid id')
        console.error(this.targetId)
        return CONSTANS.ERROR_MEMO
      }
      return this.$store.getters['link/data']
    },
    platforms () {
      return CONSTANS.PLATFORMS
    },
    formatedDescription () {
      if (!this.link.description) {
        return ''
      }
      return this.link.description
        .replace('『', '<span class="badge-lg badge-pill badge-success p-1">')
        .replace('』', '</span>')
    },
    formatedReleasedAt () {
      if (!this.link.createAt) {
        return ''
      }
      return this.$moment(this.link.createAt).format('YYYY/MM/DD HH：MM：SS')
    },
    formatedAudio () {
      if ( !this.link.voiceURL) {
        return ''
      }
      return this.link.voiceURL
    }
  },
  watch: {
    'link' (n, o) {
    }
  }
}
</script>
<style scoped>
.pade__details {
    margin-left: auto;
    margin-right: auto;
    width: 500px;
}
</style>
