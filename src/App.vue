<template>
  <v-app>
    <v-main class="main__conteiner">
      <Navbar class="navbar__conteiner" />
      <RouterView />
    </v-main>
    <Footer />
  </v-app>
</template>

<script>
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
// import LinkList from './components/pages/LinkList'
// import LinkPage from './components/pages/LinkPage'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
    // LinkList,
    // LinkPage
  },
  data () {
    return {
      //
    }
  }
}
</script>

<style>
a:hover {
  text-decoration: none;
}
a {
  color: #e8eaf6 !important;
}
.main__conteiner {
  width: 100%;
  margin:auto;
}
</style>
