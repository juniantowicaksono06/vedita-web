export default {
    loading: false,
    target: 'static',
    axios: {
        baseUrl: process.env.VEDITA_API_URL,
        proxyHeaders: false,
        credentials: false
    },
    env: {
        VEDITA_API_URL: process.env.VEDITA_API_URL
    },
    head: {
        title: 'Vedita - LiVe Digital Assistance',
        htmlAttrs: {
          lang: 'en'
        },
        meta: [
          { charset: 'utf-8' },
          { name: 'viewport', content: 'width=device-width, initial-scale=1' },
          { hid: 'description', name: 'description', content: '' },
          { name: 'format-detection', content: 'telephone=no' }
        ],
        link: [
          { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ],
        script: [
            {
                src: 'js/record.js', async: true, defer: true
            }
        ]
    },
    css: [
        '@fortawesome/fontawesome-free/css/all.min.css',
        '@fortawesome/fontawesome-free/css/solid.min.css',
        '@fortawesome/fontawesome-free/css/brands.min.css',
        '@/static/css/global.css',
    ],
    plugins: [
        '~/plugins/axios',
    ],
    components: true,
    buildModules: [
        // '@nuxtjs/fontawesome'
    ],
    fontawesome: {
        icons: {
          solid: true,
        }
    },
    modules: [
        // https://go.nuxtjs.dev/bootstrap
        'bootstrap-vue/nuxt',
        '@nuxtjs/axios',
        'cookie-universal-nuxt',
    ],
    build: {
        babel: {
          compact: true
        }
    }
}