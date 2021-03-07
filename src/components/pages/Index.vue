<template>
  <div class="index__conteiner text-center">
    <!-- <h1>{{ msg }}</h1> -->
    <!-- <h1 class="index__description">ログインして自分の声や演奏を投稿してみよう！</h1> -->
    <!-- <h2 class="index__attention">一度投稿した音声の後ろに追加したり、重ねて録音できます。どんどん音声を増やしてボイス日記を付けたり、楽器や歌を重ねて多重録音してみよう！</h2> -->
    <h2><p>ラジオ・音源ってほどじゃないけど気軽に吐き出したい聞いてほしいとき。自分用ログに。</p><p>誰が聞いてるかもわからない誰も聞いてないかもしれない。</p><p>ちょっとした思いを吐き出したり、演奏や歌を投稿してみよう</p></h2>
    <div v-if="!isLogin">
      <strong>ログインして呟いてみよう！</strong>
      <login v-if="!isLogin"></login>
    </div>
    <v-btn color=gray class="get__new__data" @click="getNewData">最新の投稿15件を取得</v-btn>
    <index-list />
    <v-btn color=gray class="get__new__data" @click="getNewData">最新の投稿15件を取得</v-btn>
  </div>
</template>

<script>
import IndexList from '../IndexList'
import Login from '../common/Login'
export default {
  name: 'Index',
  components: {
    'index-list': IndexList,
    'login': Login
  },
  methods: {
    getNewData() {
      location.reload()
    }
  },
  computed: {
    userinfo () {
      return this.$store.getters['auth/user']
    },
    isLogin () {
      return this.$store.getters['auth/check']
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.index__conteiner h1 {
  font-weight: bold;
  font-size: 24px;
}
.index__conteiner h2 {
  /* font-weight: bold; */
  margin: 15px;
  /* text-align: left; */
  font-size: 16px;
}
p {
  /* padding: 2px; */
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.index__description {
  font-size: small;
  padding: 10px;
}
.index__conteiner {
  margin: auto;
  padding: 10px;
}
.index__attention {
  color:red;
  font-weight: bold;
}
.get__new__data {
  width: 100%;
}
</style>
