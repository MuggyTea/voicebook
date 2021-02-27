<template>
  <div class="hello">
    <!-- <h1>{{ msg }}</h1> -->
    <h5>ログインして自分の声や演奏を投稿してみよう！</h5>
    <h6>一度投稿した音声の後ろに追加したり、重ねて録音できます。どんどん音声を増やしてボイス日記を付けたり、楽器や歌を重ねて多重録音してみよう！</h6>
    <index-list />
  </div>
</template>

<script>
import IndexList from '../IndexList'
export default {
  name: 'Index',
  components: {
    'index-list': IndexList
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
h1, h2 {
  font-weight: normal;
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
</style>
