import firestore from '../../plugins/firebase'
import CONSTANS from '../../components/constants'
import { ADD } from './mutation-types'
/**
 * リンクページで表示するリンク一件分のデータを管理する
 */

// DBを呼び出す
const LinkRef = firestore.collection('VoiceList')
    // const currentUserInfo = firestore.collection('currentUserInfo')

export default {
    namespaced: true,
    unsubscribe: null,
    state() {
        return {
            // 一件分なので
            data: []
        }
    },
    mutations: {
        // 受け取ったデータpayloadをステートに格納
        init(state, payload) {
            state.data = payload
        },
        // リンク追加時
        [ADD](state, payload) {
            // DBから受け取ったデータをステートにセット
            state.data.push(payload)
        },
        addData(state, payload) {
            state.data.unshift(payload)
        },
        // 呼び出すとき
        set(state, payload) {
            const index = state.data.findIndex(link => link.id === payload.id)
            if (index !== -1) {
                state.data[index] = payload
            }
        },
        // 削除時
        remove(state, payload) {
            const index = state.data.findIndex(link => link.id === payload.id)
            if (index !== -1) {
                state.data.splice(index, 1)
            }
        }
    },
    // コンポーネントはゲッターを通して状態監視する
    getters: {
        data(state) {
            return state.data
        }
    },
    actions: {
        clear({ commit }) {
            commit('init', CONSTANS.NEW_EMPTY_MEMO())
        },
        // リスナーの起動
        startListener({ commit }, payload) {
            if (this.unsubscribe) {
                console.warn('listener is already running. ', this.unsubscribe)
                this.unsubscribe()
                this.unsubscribe = null
            }
            // firestoreからデータを検索する
            this.unsubscribe = LinkRef.where('link_id', '==', payload.link_id).onSnapshot(function(querySnapshot) {
                // データが更新されるたびに呼び出される
                querySnapshot.docChanges().some(change => {
                    // 時刻がnullのものとログインユーザー以外は表示しない
                    if (!change.doc.data().screenName || !change.doc.data().createAt) {
                        console.warn('user does not exist')
                        return
                    }
                    // ステート更新するために配列に格納（DBから直接読み込むと同期が追いつかない）
                    const payload = {
                        id: change.doc.id,
                        link_id: (change.doc.id).substr(0, 4),
                        create_num: change.doc.data().create_num,
                        link_title: change.doc.data().link_title,
                        description: change.doc.data().description,
                        id_str: change.doc.data().id_str,
                        screenName: change.doc.data().screenName,
                        createAt: new Date(change.doc.data().createAt.seconds * 1000),
                        photoURL: change.doc.data().photoURL,
                        uid: change.doc.data().uid,
                        userinfo: change.doc.data().userinfo,
                        voiceURL: change.doc.data().voiceURL
                    }
                    commit('init', payload)
                        //     // ミューテーションを通してステートを更新する
                        // if (change.type === 'modified' && change.doc.data().link_id) {
                        //     console.log('change.type add', change.type)
                        //         // commit(ADD, payload)
                        //     console.log(change.doc.data())
                        //     commit('addData', change.doc.data())
                        // } else if (change.type === 'added' && change.doc.data().link_id) {
                        //     console.log('change.type add', change.type)
                        //         // // commit(ADD, payload)
                        //     console.log(change.doc.data())
                        //     commit(ADD, change.doc.data())
                        // } else if (change.type === 'removed') {
                        //     commit('REMOVE', change.doc.data())
                        // }
                })
            })
        },
        // リスナーの停止
        stopListener() {
            if (this.unsubscribe) {
                this.unsubscribe()
                this.unsubscribe = null
            }
        },
        updateMillion({ state }) {
            const million = !state.data.million
            LinkRef.doc(state.data.id).update({ million: million })
                .then(() => {

                })
                .catch(err => {
                    console.err('Error updateing document: ', err)
                })
        },
        updatePlatforms({ state }, payload) {
            const platforms = [].concat(state.data.platforms)
            if (platforms.includes(payload.platforms)) {
                platforms.splice(platforms.indexOf(payload.platforms), 1)
            } else {
                platforms.push(payload.platform)
            }
            LinkRef.doc(state.data.id).update({ platforms: platforms })
                .then(() => {

                })
                .catch(err => {
                    console.error('Error updating document: ', err)
                })
        }
    }
}