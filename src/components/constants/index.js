export default {
    ERROR_MEMO: {
        link_id: -1,
        title: 'unknown',
        description: 'unknown',
        platforms: [],
        million: false,
        createAt: null
    },
    NEW_EMPTY_MEMO() {
        return {
            description: '',
            createAt: null,
            photoURL: '',
            voiceURL: ''
        }
    },
    TWEET_URL: "https://aitter-twigene.work/tweet",
    GENERATE_URL: "https://aitter-twigene.work/generate",
    SLACK_SERVER_ERROR: "https://hooks.slack.com/services/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",
    SLACK_TWEET: "https://hooks.slack.com/services/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"
}