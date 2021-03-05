<template>
  <footer class="footer">
    <!-- <AdSense></AdSense> -->
    <v-footer
    color="primary lighten-1"
    padless
    >
    <v-row
    justify="center"
    no-gutters
    class="indigo lighten-5 py-4 text-center grey--text"
    >
    <v-btn
    v-for="link in links"
    :key="link"
    color="grey"
    text
    rounded
    class="footer__col1"
    :to="link.path"
    >
    {{ link.name }}
    </v-btn>
    <v-btn
    color="grey"
    text
    rounded
    class="footer__col1"
    href="https://twitter.com/MuggyTeaa"
    >
    製作者Twitter
    </v-btn>
    <v-btn
    color="grey"
    text
    rounded
    class="footer__col1"
    href="https://forms.gle/L1TpqXjgTygmaYsr6"
    >
    お問い合わせ
    </v-btn>
    <v-btn
    color="white"
    text
    rounded
    class="footer__col1"
    >
      <Login />
    </v-btn>
    <v-col
    class="indigo lighten-5 py-4 text-center grey--text"
    cols="12"
    >
    {{ new Date().getFullYear() }} -- <strong>おとろぐ - VoiceBook - </strong>
    </v-col>
    </v-row>
    </v-footer>
  </footer>
</template>

<script>
import Login from './Login'
import Index from '../pages/Index'
import TermsOfService from '../pages/TermsOfService'
import PrivacyPlicy from '../pages/PrivacyPolicy'
// import Adsense from '../common/AdSense'
export default {
  name: 'Footer',
  components: {
    Login
  },
  data: () => ({
    links: [
      { name: 'Home', path: '/', component: Index },
      { name: 'プライバシーポリシー', path: '/a/info/privacy-policy', component: PrivacyPlicy },
      { name: '利用規約', path: '/a/info/service', component: TermsOfService }
    ]
  }),
  computed: {
    isLogin () {
      return this.$store.getters['auth/check']
    },
    userinfo () {
      return this.$store.getters['auth/user']
    }
  }
}
</script>
<style>
.footer__col1 {
  font-size: 10px;
}
</style>
