<template>
    <div class="container py-3 mb-5">
        
        <b-modal class="modal-item" v-model="IS_MODAL_OPEN" @hide="closeModal" hide-footer size="lg" hide-header>
            <div class="container-fluid" v-on:click="closeModal"></div>
            <div class="d-block">
                <h3>{{ MODAL_TITLE }}</h3>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-12" v-html="MODAL_TEXT"></div>
                </div>
            </div>
            <b-button class="mt-3 btn-danger" block @click="closeModal">Tutup</b-button>
        </b-modal>
        <b-modal class="modal-item" v-model="IS_MODAL_RECORD_OPEN" @hide="closeRecordModal" hide-footer size="lg" hide-header>
            <div class="container-fluid" v-on:click="closeRecordModal"></div>
            <div class="d-flex justify-content-center">
                <img :src=mic_img alt="" class="mic-icon" v-on:click="onMicClick()">
            </div>
            <div class="mt-3">
                <h4 class="text-center">{{ text_info }}</h4>
            </div>
            <b-button class="mt-3 btn-danger" block @click="closeRecordModal">Tutup</b-button>
        </b-modal>
        <div class="media-button" id="mediaButton">
            <button class="btn btn-lg" :class="{'btn-disabled': !IS_PLAYING, 'btn-danger': IS_PLAYING}" v-on:click="stopAudio()">
                <span><i class="fas fa-stop fa-2xl"></i></span>
            </button>
        </div>
        <audio id="audioPlayer" controls class="d-none"></audio>
        <div class="d-flex justify-content-center h-100" :class="{'my-align-vertically-center': VEDITA_STATUS != constant.VEDITA_STATUS_IDLE, 'align-items-center': VEDITA_STATUS == constant.VEDITA_STATUS_IDLE}">
            <div class="card box-rounded">
                <div class="card-header box-rounded">
                    <div class="d-flex justify-content-center">
                        <img src="/img/logo.png" alt="" class="img-fluid w-50">
                    </div>
                </div>
                <div class="card-body box-rounded px-5" :class="{'d-none': VEDITA_STATUS != constant.VEDITA_STATUS_IDLE}">
                    <div class="selection_box btn btn-danger text-center btn-block d-flex align-items-center justify-content-center" v-on:click="triggerVedita()">
                        <p class="selection_box_text">Klik tombol untuk berinteraksi dengan Vedita</p>
                    </div>
                </div>
                <div class="card-body box-rounded mt-3" :class="{'d-none': VEDITA_STATUS == constant.VEDITA_STATUS_IDLE}">
                    <div class="row mb-3">
                        <div class="col-md-6 fade-in-div col-sm-12 col-12 mb-3">
                            <div class="selection_box btn btn-danger text-center btn-block d-flex align-items-center justify-content-center" v-on:click="infoSpeech(0, 'Informasi Terkait Syarat Ganti Kartu')">
                                <p class="selection_box_text">Informasi Terkait Syarat Ganti Kartu</p>
                            </div>
                        </div>
                        <div class="col-md-6 fade-in-div col-sm-12 col-12">
                            <div class="selection_box btn btn-danger text-center btn-block d-flex align-items-center justify-content-center" v-on:click="infoSpeech(1, 'Informasi Terkait Cara Mengaktifkan Paket Roaming')">
                                <p class="selection_box_text">Informasi Terkait Cara Mengaktifkan Paket Roaming</p>
                            </div>
                        </div>
                    </div>
                    <div class="row mb-3">
                        <div class="col-md-6 fade-in-div col-sm-12 col-12 mb-3">
                            <div class="selection_box btn btn-danger text-center btn-block d-flex align-items-center justify-content-center">
                                <p class="selection_box_text">Syarat & Ketentuan Ganti Paket Indihome</p>
                            </div>
                        </div>
                        <div class="col-md-6 fade-in-div col-sm-12 col-12">
                            <div class="selection_box btn btn-danger text-center btn-block d-flex align-items-center justify-content-center">
                                <p class="selection_box_text">Paket Unggulan Indihome, Seperti Telkomsel Dynamic, Telkomsel Jitu Paket Paket Telkomsel One</p>
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-12 fade-in-div">
                            <div class="selection_box btn btn-danger text-center btn-block d-flex align-items-center justify-content-center" v-on:click="showRecordModal()">
                                <p class="selection_box_text">Pertanyaan Umum Lainnya</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import constant from '../../config/constant';
    import tts_text from '../../misc/text_to_tts'
    export default {

        data() {
            return {
                VEDITA_STATUS: constant.VEDITA_STATUS_IDLE,
                IDLE_INTERVAL: null,
                INTERVAL_TIME: 120000,
                constant,
                TTS_TEXT: tts_text.text_to_tts,
                READ_TXT: tts_text.original_text,
                IS_PLAYING: false,
                IS_MODAL_OPEN: false,
                MODAL_TITLE: '',
                MODAL_TEXT: '',
                IS_MODAL_RECORD_OPEN: false,
                mic_img: '/img/mic-blue.png',
                text_info: 'Silahkan klik icon untuk mulai merekam',
                LANGUAGE: constant.VEDITA_LANGUAGE_ID,
                AUDIO_CONTEXT: null,
                RECORD: null,
                STREAM: null,
                IS_RECORDING: 0,
            }
        },
        watch: {
            VEDITA_STATUS(newValue, oldValue) {
                setInterval(() => {
                    this.showBox()
                }, 300)
            }
        },
        mounted() {
            this.onAudioFinish()
        },
        methods: {
            setIdle() {
                this.VEDITA_STATUS = constant.VEDITA_STATUS_IDLE
                this.IDLE_INTERVAL = null
                let all_class = document.querySelectorAll('div.fade-in-div')
                for (let div = 0; div < all_class.length; div++) {
                    all_class[div].classList.remove('show')
                }
            },
            afterRecord(audio_blob) {
                // document.querySelector("#audioPlayer").src = URL.createObjectURL(audio_blob)
                // document.querySelector("#audioPlayer").controls = true
                // document.querySelector("#audioPlayer").autoplay = true
                // document.querySelector("#audioPlayer").play()
                const formData = new FormData()
                formData.append('file', audio_blob, "recorded_audio.wav")
                formData.append("language", this.LANGUAGE)
                formData.append("request_type", "file")
                this.$axios.$post('vedita-speech-recognizer', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                    const {data} = response
                    const {text} = data
                    if(text == "") {
                        return
                    }
                    const payload = JSON.stringify({
                        'model': "gpt-3.5-turbo",
                        'messages': [
                            {
                                "role": "system", 
                                "content": "You are a helpful assistant, you give answer as short as possible"
                            },
                            {
                                "role": "user",
                                "content": text
                            }
                        ]
                    })
                    const headers = {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer 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`
                    }
                    fetch("https://api.openai.com/v1/chat/completions", {
                        method: 'POST',
                        headers: headers,
                        body: payload
                    }).then((response) => {
                        if(!response.ok) {
                            throw new Error("Network response was not ok")
                        }
                        return response.json()
                    })
                    .then((result) => {
                        const {choices} = result
                        const message = choices[0]['message']['content']
                        const formData = new FormData()
                        formData.append('text', message)
                        formData.append('language', this.LANGUAGE)
                        this.$axios.$post('vedita-tts', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }).then((response) => {
                            const {data} = response
                            if("audio_b64" in data) {
                                const {audio_b64} = data
                                const binaryAudioData = atob(audio_b64)
                                const arrayBuffer = new ArrayBuffer(binaryAudioData.length)
                                const view = new Uint8Array(arrayBuffer)
                                for (let i = 0; i < binaryAudioData.length; i++) {
                                    view[i] = binaryAudioData.charCodeAt(i)   
                                }

                                const blob = new Blob([arrayBuffer], {type: 'audio/wav'})
                                const objectURL = URL.createObjectURL(blob)
                                document.querySelector("#audioPlayer").src = objectURL
                                document.querySelector("#audioPlayer").play()
                                
                                this.VEDITA_STATUS = constant.VEDITA_STATUS_TRIGGER
                                
                                this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                                this.IS_PLAYING = true
                            }
                        }).catch((error) => {
                            this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                        })
                    })
                    .catch(error => {
                        // Handle errors here
                        console.error('Fetch error:', error);
                    });
                    
                    // if("audio_b64" in data) {
                    //     const {audio_b64} = data
                    //     const binaryAudioData = atob(audio_b64)
                    //     const arrayBuffer = new ArrayBuffer(binaryAudioData.length)
                    //     const view = new Uint8Array(arrayBuffer)
                    //     for (let i = 0; i < binaryAudioData.length; i++) {
                    //         view[i] = binaryAudioData.charCodeAt(i)   
                    //     }

                    //     const blob = new Blob([arrayBuffer], {type: 'audio/wav'})
                    //     const objectURL = URL.createObjectURL(blob)
                    //     document.querySelector("#audioPlayer").src = objectURL
                    //     document.querySelector("#audioPlayer").play()
                    //     this.IS_PLAYING = true;
                    // }
                })
            },
            onMicClick() {
                if(this.IS_RECORDING == 0) {
                    this.IS_RECORDING = 1
                    console.log("START RECORDING...")
                    this.startRecording()
                }
                else {
                    let callback = this.afterRecord
                    this.stopRecording(callback)
                    this.IS_RECORDING = 0
                    this.mic_img = "/img/mic-blue.png"
                    this.text_info = "Silahkan klik icon untuk mulai merekam"
                    console.log("STOP RECORDING!")
                }
            },
            stopAudio() {
                const audio = document.querySelector('#audioPlayer')
                audio.pause()
                audio.currentTime = 0
                audio.load()
                this.IS_PLAYING = false
            },
            onAudioFinish() {
                const audio = document.querySelector('#audioPlayer')
                audio.addEventListener("ended", () => {
                    this.IS_PLAYING = false
                })
            },
            sleep(ms) {
                return new Promise(resolve => setTimeout(resolve, ms))
            },
            async showBox() {
                let all_class = document.querySelectorAll('div.fade-in-div')
                for (let div = 0; div < all_class.length; div++) {
                    all_class[div].classList.add('show')
                    await this.sleep(500)
                }
            },
            showModal() {
                this.IS_MODAL_OPEN = true;
            },
            showRecordModal() {
                this.IS_MODAL_RECORD_OPEN = true;
            },
            closeModal() {
                this.IS_MODAL_OPEN = false;
            },
            closeRecordModal() {
                this.IS_MODAL_RECORD_OPEN = false;
            },
            infoSpeech(index, modal_title) {
                clearInterval(this.IDLE_INTERVAL)
                const formData = new FormData()
                formData.append('text', this.TTS_TEXT[index])
                this.$axios.$post('vedita-tts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                    this.MODAL_TITLE = modal_title
                    this.MODAL_TEXT = tts_text.original_text[index]
                    this.showModal()
                    const {data} = response
                    if("audio_b64" in data) {
                        const {audio_b64} = data
                        const binaryAudioData = atob(audio_b64)
                        const arrayBuffer = new ArrayBuffer(binaryAudioData.length)
                        const view = new Uint8Array(arrayBuffer)
                        for (let i = 0; i < binaryAudioData.length; i++) {
                            view[i] = binaryAudioData.charCodeAt(i)   
                        }

                        const blob = new Blob([arrayBuffer], {type: 'audio/wav'})
                        const objectURL = URL.createObjectURL(blob)
                        document.querySelector("#audioPlayer").src = objectURL
                        document.querySelector("#audioPlayer").play()
                        
                        this.VEDITA_STATUS = constant.VEDITA_STATUS_TRIGGER
                        
                        this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                        this.IS_PLAYING = true
                    }
                }).catch((error) => {
                    this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                })
            },
            async startRecording() {
                this.STREAM = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
                this.mic_img = "/img/mic-green.png"
                this.text_info = "Silahkan berbicara"
                this.AUDIO_CONTEXT = new AudioContext();
                let input = this.AUDIO_CONTEXT.createMediaStreamSource(this.STREAM);
                this.RECORD = new Recorder(input,{numChannels:1})
                this.RECORD.record()
            },
            stopRecording(callback = false) {
                this.RECORD.stop()
                this.STREAM.getAudioTracks()[0].stop()
                if(callback !== false) {
                    this.RECORD.exportWAV(callback)
                }
            },
            triggerVedita() {
                const formData = new FormData()
                formData.append('text', "Halo, Apa ada yang bisa saya bantu? Silakan pilih pertanyaan berikut ini, atau anda juga dapat bertanya dengan klik tombol Pertanyaan Umum Lainnya, dan saya akan menjawab sebisa mungkin")
                this.$axios.$post('vedita-tts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                    const {data} = response
                    if("audio_b64" in data) {
                        const {audio_b64} = data
                        const binaryAudioData = atob(audio_b64)
                        const arrayBuffer = new ArrayBuffer(binaryAudioData.length)
                        const view = new Uint8Array(arrayBuffer)
                        for (let i = 0; i < binaryAudioData.length; i++) {
                            view[i] = binaryAudioData.charCodeAt(i)   
                        }

                        const blob = new Blob([arrayBuffer], {type: 'audio/wav'})
                        const objectURL = URL.createObjectURL(blob)
                        document.querySelector("#audioPlayer").src = objectURL
                        document.querySelector("#audioPlayer").play()
                        
                        this.VEDITA_STATUS = constant.VEDITA_STATUS_TRIGGER
                        
                        this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                        this.IS_PLAYING = true
                    }
                }).catch((error) => {
                    this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                })
            }
        }
    }
</script>