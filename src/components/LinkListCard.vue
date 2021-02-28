<template>
<div class="linkcard">
  <v-card
  width="320px"
  raised
  elevation="10"
  >
    <v-container fill-height fluid pa-2>
      <v-layout align-center fill-height>
        <v-flex align-end xs12 flexbox>
    <v-bottom-sheet inset>
      <v-card tile>
        <v-progress-linear
          :value="50"
          class="my-0"
          height="3"
        ></v-progress-linear>

        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>{{ formatedTitle }}</v-list-item-title>
              <v-list-item-subtitle>{{ link.userinfo.displayName }}</v-list-item-subtitle>
            </v-list-item-content>

            <v-spacer></v-spacer>

            <v-list-item-icon :class="{ 'mx-5': $vuetify.breakpoint.mdAndUp }">
              <v-btn icon>
                <v-icon>mdi-pause</v-icon>
              </v-btn>
            </v-list-item-icon>

          </v-list-item>
        </v-list>
      </v-card>
    </v-bottom-sheet>
          <!-- <v-img :src="link.src" max-height="100px"></v-img> -->
          <router-link
            v-bind:to="{name: 'LinkPage',
            params: {link_id: link.link_id, id: link.id, screen_name: link.screenName} }"
          >
          <v-img
          src='../assets/cat-5496162_640.jpg'
          height="200px"
          v-if="!link.photoURL"
          >
          <v-btn
          color = "primary"
          v-bind:to="{name: 'LinkList', params: {screen_name: link.screenName}}"
          >
          {{ link.userinfo.displayName }}
          </v-btn>
          </v-img>
          <v-img
          v-else
          :src="link.photoURL"
          height="200px"
          >
          <v-btn color="indigo"
          v-bind:to="{name: 'LinkList', params: {screen_name: link.screenName}}"
          >
          {{ link.userinfo.displayName }}
          </v-btn>
          </v-img>
          </router-link>
          <audio controls :src="formatedAudio" type="audio/wav"></audio>
          <router-link v-bind:to="{name: 'LinkPage',
            params: {link_id: link.link_id, id: link.id, screen_name: link.screenName} }">
          <v-card-title class="card__title">
            <h3>{{ formatedTitle }}</h3>
              </v-card-title>
              </router-link>
              <v-card-text class="card__text">
                <h6 class="grey--text">{{ formatedDescription }}</h6>
              </v-card-text>
          <v-card-actions class="card__actions">
            <!-- <div class="card-body text-left">
              <p class="card-text" v-html="formatedDescription" />
              <hr class="mb-3" />
              <small>{{ formatedReleasedAt }}</small>
            </div> -->
            <!-- 削除機能 -->
            <v-btn text
              v-if="!userinfo"
              >
            </v-btn>
            <v-btn text
              v-else-if="link.screenName === userinfo.screenName"
              v-on:click="remove(link.id)">
              <font-awesome-icon :icon="['fas', 'trash-alt']">
              </font-awesome-icon>
            </v-btn>
            <v-spacer></v-spacer>
            <!-- <v-btn text>
              <font-awesome-icon :icon="['fas', 'heart']" />
            </v-btn> -->
            <v-btn text @click="PostingTweet">
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </v-btn>
            <!-- <v-btn text>
              <font-awesome-icon :icon="['fab', 'youtube']" />
            </v-btn> -->
          </v-card-actions>
        </v-flex>
      </v-layout>
    </v-container>
  </v-card>
  </div>
</template>

<script>
import axios from 'axios'
import CONSTANT from './constants/index'
export default {
  name: 'LinkListCard',
  data () {
    return {releasedAtFromNow: this.getReleasedAtFromNow()
    }
  },
  moutend () {
    // releasedAtFromNowを1分ごとに更新する
    window.setInerval(() => {
      this.releasedAtFromNow = this.getReleasedAtFromNow()
    }, 1000 * 60)
  },
  props: {
    'link': {
      type: Object,
      required: true
    }
  },
  methods: {
    PostingTweet (btn) {
      if (this.processing) return
      this.processing = true
      const userinfo = this.$store.getters['auth/user']
      this.processing = false
      const tweetPage = this.createTweetUrl()
      // window.location.href = tweetPage
      if (!window.open(tweetPage)) {
        window.location.href = tweetPage
      } else {
        // window.open(tweetPage)
        window.location.reload(false)
      }
    },
    createTweetUrl() {
            // Twitter用のurl作成
      const url = encodeURIComponent(location.href+this.link.screenName+'/'+this.link.id)
      const hashTags = encodeURI('こえろぐ,VoiceBook')
      // const generatedText = encodeURI(this.link.screenName)
      // this.tweetUrl = 'https://twitter.com/intent/tweet?text=' + generatedText + '&hashtags=' + hashTags + '&url=' + url
      this.tweetUrl = 'https://twitter.com/intent/tweet?hashtags=' + hashTags + '&url=' + url
      return this.tweetUrl
    },
    remove (id) {
      this.$store.dispatch('links/deleteLink', {id})
    },
    getReleasedAtFromNow () {
      if (!this.link || !this.link.createAt) {
        return ''
      }
      const createAt = new Date(this.link.createAt.seconds * 1000)
      return this.$moment(createAt).fromNow()
    },
    getOmissionAndPlusMidpoint (str, limit) {
      if (str.length < limit) {
        return str
      }
      return str.substr(0, limit) + '...'
    }
  },
  computed: {
    userinfo () {
      return this.$store.getters['auth/user']
    },
    formatedTitle () {
      if (!this.link || !this.link.link_title) {
        return ''
      }
      return this.getOmissionAndPlusMidpoint(this.link.link_title, 16)
    },
    formatedDescription () {
      if (!this.link || !this.link.description) {
        return ''
      }
      return this.getOmissionAndPlusMidpoint(this.link.description, 60)
    },
    formatedAudio () {
      if ( !this.link.voiceURL) {
        return ''
      }
      return this.link.voiceURL
    },
    formatedReleasedAt () {
      if (!this.link.createAt) {
        return ''
      }
      return this.$moment(this.link.createAt).format('YYYY/MM/DD HH:MM:SS')
    },
  },
  watch: {
    'link' (n, o) {
    }
  }
}
</script>
<style>
.linkcard {
  padding:1px;
}
.card__title {
  padding-top:5px;
  padding-bottom: 5px;
  color:#000;
}
.card__text {
  padding-top:1px;
  padding-bottom: 5px;
}
.card__actions {
  padding:0px;
}
</style>
