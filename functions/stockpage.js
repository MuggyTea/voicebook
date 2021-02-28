import firestore from './src/plugins/firebase'
const functions = require('firebase-functions')
const admin = require('firebase-admin')
const db = firestore.collection('VoiceList')

const CONFIG = functions.config()
const app_domain = CONFIG.app.domain
const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630

const func = functions.https.onRequest((req, res) => {
    // URLを/で分ける。ドメイン、ユーザー名、ユーザーidが取れる
    console.log(res)
    console.log(req)
    const [, userScreenName, endpoint] = req.path.split('/')
    return db.doc(endpoint).get().then(snap => {
        if (!snap) {
            res.status(404).end('404 Not Found')
            console.log(res.statue)
            return
        }
        console.log(snap)
            // dbの情報を格納
        const stockItem = snap ? snap.data() : {}
            // ユーザーネームを取得
        const uname = stockItem.screenName || ''
        const photoURL = stockItem.photoURL
        const voiceURL = stockItem.voiceURL
        const userId = stockItem.id
        const html = createHtml(uname, userId, photoURL, voiceURL)
            // キャッシュの設定
        res.set('Cache-Control', 'public, max-age=600, s-maxage=600')
        res.status(200).end(html)
        return
    }).catch((err) => {
        console.warn(err)
            // 略 : エラー時はデフォルトのhtml（固定のOGP）を返す
    })
});

const createHtml = (uname, userId, photoURL, voiceURL) => {
    const SITEURL = `https://${app_domain}`
    const PAGEURL = `${SITEURL}/${uname}/${userId}`
    const TITLE = `${uname}' のこえろぐ`
    const DESCRIPTION = '音声を録音して投稿するサービス。喋って日記を付けたり演奏や歌を投稿してみよう'
    return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>こえろぐ -VoiceBook- </title>
    <!-- 共通設定 -->
    <meta property="og:title" content="${TITLE}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="${photoURL}">
    <meta property="og:image:width" content="${OGP_IMG_WIDTH}">
    <meta property="og:image:height" content="${OGP_IMG_HEIGHT}">
    <meta property="og:description" content="${DESCRIPTION}">
    <meta property="og:url" content="${PAGEURL}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="こえろぐ -VoiceBook-">
    <meta property="og:locale" content="ja_JP">
    <meta property="og:audio" content="${voiceURL}">
    <!-- /共通設定 -->
  
    <!-- Twitterの設定 -->
    <meta name="twitter:card" content="player">
    <meta name="twitter:site" content="${SITEURL}">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:image" content="${photoURL}">
    <meta name="twitter:description" content="${DESCRIPTION}">
    <meta name="twitter:creator" content="${uname}">
    <meta name="twitter:player" content="${voiceURL}">
    <meta name="twitter:image" content="${photoURL}">
    <meta name="twitter:player:width" content="480px">
    <meta name="twitter:player:height" content="480px">
    <!-- /Twitterの設定 -->
  </head>
  <body>
    <script type="text/javascript">window.location="/";</script>
  </body>
</html>
`
}

module.exports = func