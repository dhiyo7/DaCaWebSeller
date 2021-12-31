module.exports = {
    presets: ['@babel/preset-react'],
    plugins: [
        ['module-resolver', {
        root:['./src'],
            alias:{
                '@src': './src',
                '@assets': './src/assets',
                '@config': './src/config',
                '@constants': './src/constants',
                '@components': './src/components',
                '@store': './src/store',
                '@routes': './src/routers',
                '@utils': './src/utils'
            }
        }]
    ]
}