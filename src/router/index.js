import Vue from 'vue'
import VueRouter from 'vue-router'
// import firebase from 'firebase'
// // 状態管理のストアをインポートする
// import store from '../store'

// ページコンポーネントのインポート
import LinkList from '../components/pages/LinkList'
import LinkPage from '../components/pages/LinkPage'
import NotFound from '../components/pages/NotFound'
import PrivacyPolicy from '../components/pages/PrivacyPolicy'
import TermsOfService from '../components/pages/TermsOfService'
import Index from '../components/pages/Index'

// VueRouterプラグインを使用する
// これによって<RouterView />コンポーネントなどを使うことができる
Vue.use(VueRouter)

// パスとコンポーネントのマッピング
const routes = [{
        path: '/',
        component: Index
    },
    {
        path: '/page/:screen_name/:id',
        name: 'LinkPage',
        component: LinkPage,
        props: true, // データの受け渡しを可能にする
        meta: {
            title: 'details of link'
        }
    },
    {
        path: '/:screen_name',
        name: 'LinkList',
        component: LinkList,
        props: true,
        meta: {
            title: 'link list'
        }
    },
    {
        path: '*',
        component: NotFound
    },
    {
        path: '/404',
        component: NotFound
    },
    {
        name: 'TermsOfService',
        path: '/a/info/service',
        component: TermsOfService
    },
    {
        name: 'PrivacyPolicy',
        path: '/a/info/privacy-policy',
        component: PrivacyPolicy
    },
    {
        path: '*',
        redirect: '/404'
    }
]

// VueRouterインスタンスを作成する
const router = new VueRouter({
    mode: 'history',
    routes
})

// VueRouterインスタンスをエクスポートする
// main.jsでインポートする
export default router