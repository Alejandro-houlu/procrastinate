module.exports = {
    async rewrites() {
        return [
            {
            source: '/',
            destination: 'http://localhost:8080'
            },
        ]
    },
}