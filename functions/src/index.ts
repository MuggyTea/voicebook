// import * as functions from "firebase-functions";

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const functions = require('firebase-functions')
const admin = require('firebase-admin')
admin.initializeApp();
const db = admin.firestore().collection('VoiceList')

const CONFIG = functions.config()
// const app_domain = CONFIG.app.domain
const OGP_IMG_WIDTH = 1200
const OGP_IMG_HEIGHT = 630

exports.stockpage = functions.https.onRequest((req: any, res: any) => {
        // URLを/で分ける。ドメイン、ユーザー名、ユーザーidが取れる
        console.log(res)
        console.log(req)
            // キャッシュの設定
        res.set('Cache-Control', 'public, max-age=600, s-maxage=600')
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8'
        })
        const [domain, , ,endpoint] = req.path.split('/')
        // return db.where('id', '==', endpoint).onSnapshot(function(snap: any) {
            return db.doc(endpoint).get().then((snap: any) => {
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
            const photoUrl = stockItem.photoURL
                // const photoUrl = 'https://test'
            const voiceUrl = stockItem.voiceURL
            const userId = stockItem.id
            const title = stockItem.link_title
            const html = createHtml(uname, userId, photoUrl, voiceUrl, domain, title)
            res.status(200).end(html)
            return
        }).catch((err: any) => {
            console.warn(err)
            console.log(res)
            console.log(req)
            res.end(domain)
                // 略 : エラー時はデフォルトのhtml（固定のOGP）を返す
        })
    })

const createHtml = (uname: String, userId: String, photoUrl: String, voiceUrl: String, app_domain: String, title: String) => {
    const SITEURL = `https://${app_domain}`
    const PAGEURL = `${SITEURL}/page/${uname}/${userId}`
    const TITLE = `ラジオ・音源ってほどじゃないけど気軽に吐き出したい聞いてほしい。自分用ログに。喋って日記を付けたり演奏や歌を投稿してみよう | おとろぐ -VoiceBook-`
    const DESCRIPTION = 'ラジオ・音源ってほどじゃないけど気軽に吐き出したい聞いてほしい。自分用ログに。喋って日記を付けたり演奏や歌を投稿してみよう | おとろぐ -VoiceBook-'
    return `<!DOCTYPE html>
<html>
  <head prefix="og: http://ogp.me/ns# fb: http://ogp.me/ns/fb# website: http://ogp.me/ns/website#">
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <title>おとろぐ -VoiceBook- </title>
    <!-- Global site tag (gtag.js) - Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-9C97LRWCX4"></script>
    <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());

    gtag('config', 'G-9C97LRWCX4');
    </script>
    <!-- 共通設定 -->
    <meta property="og:title" content="${TITLE}">
    <meta property="og:type" content="article">
    <meta property="og:image" content="`+photoUrl+`;">
    <meta property="og:image:width" content="${OGP_IMG_WIDTH}">
    <meta property="og:image:height" content="${OGP_IMG_HEIGHT}">
    <meta property="og:description" content="${DESCRIPTION}">
    <meta property="og:url" content="${PAGEURL}">
    <meta property="og:type" content="article">
    <meta property="og:site_name" content="こえろぐ -VoiceBook-">
    <meta property="og:locale" content="ja_JP">
    <meta property="og:audio" content="`+voiceUrl+`">
    <!-- /共通設定 -->
  
    <!-- Twitterの設定 -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:site" content="${SITEURL}">
    <meta name="twitter:title" content="${TITLE}">
    <meta name="twitter:image" content="`+photoUrl+`">
    <meta name="twitter:description" content="${DESCRIPTION}">
    <meta name="twitter:creator" content="${uname}">
    <!--
    <meta name="twitter:player" content="`+voiceUrl+`">
    <meta name="twitter:player:stream" content="`+voiceUrl+`">
    <meta name="twitter:player:width" content="480px">
    <meta name="twitter:player:height" content="480px">
    -->
    <!-- /Twitterの設定 -->
  </head>
  <body>
    <script type="text/javascript">window.location="/page/${uname}/${userId}";</script>
  </body>
</html>
`
}

// module.exports = stockpage
