<template>
  <div class="index__conteiner text-center">
    <!-- <h1>{{ msg }}</h1> -->
    <h1 class="index__description">ログインして自分の声や演奏を投稿してみよう！</h1>
    <!-- <h2 class="index__attention">一度投稿した音声の後ろに追加したり、重ねて録音できます。どんどん音声を増やしてボイス日記を付けたり、楽器や歌を重ねて多重録音してみよう！</h2> -->
    <v-btn color=gray class="get__new__data" @click="getNewData">最新の投稿15件を取得</v-btn>
    <index-list />
    <v-btn color=gray class="get__new__data" @click="getNewData">最新の投稿15件を取得</v-btn>
  </div>
</template>

<script>
import IndexList from '../IndexList'
export default {
  name: 'Index',
  components: {
    'index-list': IndexList
  },
  methods: {
    getNewData() {
      location.reload()
    }
  },
  computed: {
    userinfo () {
      return this.$store.getters['auth/user']
    }
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
  font-weight: bold;
  font-size: 20px;
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
}
.index__attention {
  color:red;
  font-weight: bold;
}
.get__new__data {
  width: 100%;
}
</style>
