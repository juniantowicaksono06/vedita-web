// plugins/axios-no-verify.js
import https from 'https';

// Create a new Axios instance with a custom httpsAgent

// const instance = axios.create({
//   httpsAgent: new https.Agent({
//     rejectUnauthorized: false, // Disable certificate verification
//   }),
// });

export default ({ $axios }) => {
    $axios.defaults.httpsAgent = new https.Agent({ rejectUnauthorized: false })
    $axios.onRequest(config => {
        config.headers.common['app-name'] = 'VEDITA'
    })
};