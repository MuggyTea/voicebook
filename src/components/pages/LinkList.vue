<template>
  <div class="link-list">
    <user-profile
    v-bind:user_profile="screen_name"
     />
    <v-card>
      <v-container fluid grid-list-md>
        <v-layout row wrap justify-content-center>
          <link-list-form></link-list-form>
            <link-list-card v-for="(link, index) in links" v-bind:key="index" v-bind:link="link"></link-list-card>
        </v-layout>
      </v-container>
    </v-card>
  </div>
</template>

<script>
// import LinkPhoto from '../LinkPhoto'
// import OneLink from '../OneLink'
import LinkListCard from '../LinkListCard'
import LinkListForm from '../LinkListForm'
import UserProfile from '../UserProfile'

export default {
  name: 'LinkList',
  components: {
    // 'link-photo': LinkPhoto,
    // 'one-link': OneLink,
    'link-list-card': LinkListCard,
    'link-list-form': LinkListForm,
    'user-profile': UserProfile
  },
  // data () {
  //   return {
  //   }
  // },
  props: [
    'screen_name'
  ],
  // pathの:idを直接書き換えた時の対応
  beforeRouteUpdate (to, from, next) {
    // 動的セグメントが変わった場合は、コールバック関数でtargetIdを更新する
    this.screen_name = to.params.screen_name
    next()
    this.init()
    this.start(this.screen_name)
    this.getUser(this.screen_name)
  },
  mounted () {
    // this.init()
    // this.start(this.screen_name)
    // this.getUser(this.screen_name)
  },
  destroyed () {
    this.stop()
  },
  methods: {
    init () {
      this.$store.dispatch('links/clear')
    },
    start (screenName) {
      this.$store.dispatch('links/startListener', {screenName})
    },
    stop () {
      this.$store.dispatch('links/stopListener')
    },
    getUser (userProfile) {
      this.$store.dispatch('user/userData', {screen_name: userProfile})
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
    links () {
      return this.$store.getters['links/data']
    },
    userdata () {
      return this.$store.getters['user/userProfile']
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
