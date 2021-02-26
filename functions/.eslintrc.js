// module.exports = {
//     root: true,
//     env: {
//         browser: true,
//         node: true
//     },
//     parserOptions: {
//         parser: 'babel-eslint',
//         ecmaVersion: 6
//     },
//     plugins: [],
//     // ここにカスタムルールを追加します。
//     rules: {
//         quotes: ["error", "double"],
//         "no-var": 0,
//         "prefer-const": 0,
//         "no-unused-vars": "off"
//         "prettier/prettier": [
//             "error",
//             {
//                 "singleQuote": true, //シングルクォーテーションのフォーマット 参考）https://prettier.io/docs/en/options.html#quotes
//                 "semi": false //セミコロンのフォーマット 参考）https://prettier.io/docs/en/options.html#semicolons
//             }
//         ],
//     },
//     extends: [
//         "eslint:recommended", //ESLintで基本的なルールチェック(更に細かく個別指定可)
//         "plugin:prettier/recommended" //一番下に書かないとうまく動かない場合も
//     ]
// }