<template>
    <div class="container py-1 px-0 mb-5" ref="mainContainer">
        <script src="https://cdn.jsdelivr.net/npm/jquery@3.5.1/dist/jquery.slim.min.js" integrity="sha384-DfXdz2htPH0lsSSs5nCTpuj/zy4C+OGpamoFVy38MVBnE+IbbVYUew+OrCXaRkfj" crossorigin="anonymous"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.6.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-Fy6S3B9q64WdZWQUiU+q4/2Lc9npb8tCaSX9FK7E8HnRr0Jz8D6OP9dO5Vg3Q9ct" crossorigin="anonymous"></script>
        <!-- WELCOME SCREEN -->
        <div class="h-100" v-if="VEDITA_STATUS == constant.VEDITA_STATUS_IDLE">
            <div class="position-relative h-100">
                <div class="h-100 d-flex align-items-center">
                    <img src="img/maskot_vedita.png" alt="Maskot Vedita" id="maskotVedita">
                </div>
                <button class="btn selection_box rounded-pill btn-block text-white" id="btnStartVedita" @click="triggerVedita()">
                    <h3 class="telkomsel-batik-regular">Mulai veDita</h3>
                </button>
                <div id="greeting">
                    <h3 class="telkomsel-batik-regular text-white" style="margin: 0;">
                        Selamat datang di veDita
                    </h3>
                    <p class="telkomsel-batik-regular text-white" style="margin: 0;">
                        live digital assistant siap membantu anda
                    </p>
                </div>
            </div>
        </div>
        <!-- AKHIR WELCOME SCREEN -->
        <div class="loading" :class="{'d-none': LOADING == false}"></div>
        <b-modal class="modal-item" centered v-model="IS_PROMO_MODAL_OPEN" @hide="promoCloseModal" hide-footer size="lg" hide-header>
            <div class="container-fluid" v-on:click="promoCloseModal"></div>
            <iframe :src="PROMO_URL" frameborder="0" class="w-100" style="min-height: 1024px;"></iframe>
        </b-modal>
        <b-modal class="modal-item" centered v-model="IS_MODAL_OPEN" @show="modalOpen" @hide="closeModal" hide-footer size="lg" hide-header>
            <div class="container-fluid" v-on:click="closeModal"></div>
            <div class="d-block">
                <div class="container-fluid">
                    <div class="w-100 justify-content-center d-flex"> <img :src="MODAL_IMG" alt="faq image" class="img-fluid" :class="{'d-none': (MODAL_IMG == '' || MODAL_IMG == null)}" /> </div>
                </div>
            </div>
            <div class="container">
                <div class="row mt-4">
                    <div class="col-12" v-html="MODAL_TEXT"></div>
                </div>
            </div> <!-- <b-button class="mt-3 btn-danger selection_box" block @click="closeModal">Tutup</b-button> -->
        </b-modal>
        <b-modal class="modal-item" centered v-model="IS_MODAL_RECORD_OPEN" @hide="closeRecordModal" hide-footer size="lg" hide-header>
            <div class="container-fluid" v-on:click="closeRecordModal"></div>
            <div class="d-flex justify-content-center"> <img :src=mic_img alt="" class="mic-icon" v-on:click="onMicClick()"> </div>
            <div class="mt-3">
                <h4 class="text-center">{{ text_info }}</h4>
            </div>
            <b-button class="mt-3 btn-danger" block @click="closeRecordModal">Tutup</b-button>
        </b-modal>
        <div class="media-button" :class="{'d-none': !IS_PLAYING || VEDITA_STATUS == constant.VEDITA_STATUS_SUB_CATEGORY}" id="mediaButton"> <button class="btn btn-lg" :class="{'btn-disabled': !IS_PLAYING, 'btn-danger': IS_PLAYING}" v-on:click="stopAudio()"> <span> <i class="fas fa-stop fa-2xl"></i> </span> </button> </div>
        <div class="media-button" :class="{'d-none': (VEDITA_STATUS != constant.VEDITA_STATUS_SUB_CATEGORY || !IS_PLAYING)}" id="mediaButton2"> <button class="btn no-rounded btn-lg" :class="{'btn-disabled': !IS_PLAYING, 'btn-danger': IS_PLAYING}" v-on:click="closeModal()"> Tutup </button> </div> <!-- <div class="media-button" :class="{'d-none': (!(VEDITA_STATUS == constant.VEDITA_STATUS_SUB_CATEGORY || VEDITA_STATUS == constant.VEDITA_STATUS_CATEGORY) || IS_PLAYING)}" id="mediaButton3"><button class="btn no-rounded btn-lg" :class="{'btn-danger': !IS_PLAYING}" v-on:click="returnHome()"><span><i class="fas fa-home fa-2xl"></i></span></button></div> --> <audio id="audioPlayer" class="d-none"></audio>
        <div class="container-fluid py-0 px-0" v-if="VEDITA_STATUS == constant.VEDITA_STATUS_CATEGORY || VEDITA_STATUS == constant.VEDITA_STATUS_SUB_CATEGORY">
            <div class="category_top_box" v-if="VEDITA_STATUS == constant.VEDITA_STATUS_CATEGORY"> 
                <button class="btn" id="arrowBackBtn" @click="returnHome()"> 
                    <img src="img/arrow-back.png" alt="arrow-back" id="arrowBack"> 
                </button> 
                <img src="img/Logo_telkomsel.png" alt="logo telkomsel" id="logoTelkomsel"> 
                <div class="container-fluid">
                    <img src="img/maskot_vedita.png" alt="Maskot Vedita" id="maskotVedita2">
                    <div id="maskotVeditaBubble" class="card rounded-pill">
                        <div class="card-body rounded-pill">
                            <div class="d-flex">
                                <img src="img/pesan.png" alt="text bubble" class="mr-3">
                                <h3 class="telkomsel-batik-regular">Hai Vedita siap bantu kebutuhanmu ya!</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- halaman 2 setelah mulai vedita -->
            <div :class="{'d-none': !(VEDITA_STATUS == constant.VEDITA_STATUS_CATEGORY)}">
                <div style="margin-top: 320px;">
                    <div class="card box-rounded"> 
                        <div class="card-body box-rounded">
                            <h1 class="telkomsel-batik-bold text-center text-orange text-lg mb-5 mt-3">Informasi</h1>
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-3" style="padding: 0">
                                        <div class="d-flex justify-content-center" v-on:click="listSubCategory(1, 'KARTU SIM')">
                                            <img src="/img/SIM-icon.png" alt="KARTU SIM" width="48" style="position: relative; top: -15px">
                                        </div>
                                        <br/>
                                        <p class="selection_box_text text-center telkomsel-batik-regular text-small" style="position: relative; top: -37px">KARTU SIM</p>
                                    </div>
                                    <div class="col-3"  v-on:click="listSubCategory(2, 'ROAMING')" style="padding: 0">
                                        <div class="d-flex justify-content-center">
                                            <img src="/img/Roaming.png" alt="ROAMING" width="64" style="position: relative; top: -15px">
                                        </div>
                                        <br/>
                                        <p class="selection_box_text text-center telkomsel-batik-regular text-small" style="position: relative; top: -41px">ROAMING</p>
                                    </div>
                                    <div class="col-3"  v-on:click="listSubCategory(3, 'INDIHOME')" style="padding: 0">
                                        <div class="d-flex justify-content-center">
                                            <img src="/img/Indihome.png" alt="INDIHOME" width="64" style="position: relative; top: -15px">
                                        </div>
                                        <br/>
                                        <p class="selection_box_text text-center telkomsel-batik-regular text-small" style="position: relative; top: -37px">INDIHOME</p>
                                    </div>
                                    <div class="col-3"  v-on:click="listSubCategory(4, 'TELKOMSEL ONE')" style="padding: 0">
                                        <div class="d-flex justify-content-center">
                                            <img src="/img/TselOne.png" alt="Telkomsel One" width="64" style="position: relative; top: -10px">
                                        </div>
                                        <br/>
                                        <p class="selection_box_text text-center telkomsel-batik-regular text-small" style="position: relative; top: -17px">TELKOMSEL ONE</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <div class="card box-rounded"> 
                        <div class="card-body box-rounded">
                            <h1 class="telkomsel-batik-bold text-center text-orange text-lg mb-5 mt-3">Layanan</h1>
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-6">
                                        <a href="https://grapari.telkomsel.co.id/goshow/registration?grapari_id=32MSB1SH" class="href" style="text-decoration: none; color: black;">
                                            <div class="d-flex justify-content-center">
                                                <img src="/img/Antrian.png" alt="ANTREAN" width="64">
                                            </div>
                                            <br/>
                                            <p class="selection_box_text text-center telkomsel-batik-regular">ANTREAN</p>
                                        </a>
                                    </div>
                                    <div class="col-6" v-on:click="showRecordModal()">
                                        <div class="d-flex justify-content-center" style="position: relative; top: -15px">
                                            <img src="/img/Question.png" alt="LAYANAN" width="64">
                                        </div>
                                        <br/>
                                        <p class="selection_box_text text-center telkomsel-batik-regular" style="position: relative; top: -25px">PERTANYAAN UMUM</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div style="margin-top: 10px;">
                    <div class="card box-rounded" style="margin-bottom: 200px">
                        <div class="card-body box-rounded">
                            <div id="promoInfo" class="carousel slide" data-ride="carousel">
                                <div class="carousel-inner">
                                    <div class="carousel-item" :class="{'active': index == 0}" v-for="(pr, index) in PROMO">
                                        <div class="row">
                                            <div class="col-6">
                                                <img :src="pr['promo_image_url']" class="d-block w-100 box-rounded" alt="...">
                                            </div>
                                            <div class="col-6">
                                                <h3 class="telkomsel-batik-regular text-danger mt-2">{{ pr['promo_platform'] }}</h3>
                                                <h2 class="telkomsel-batik-regular mt-2">{{ pr['promo_title'] }}</h2>
                                                <button class="btn btn-danger telkomsel-batik-regular text-white rounded-pill" v-on:click="showPromo(pr['id'])">Click Me for Detail</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button class="carousel-control-prev" type="button" data-target="#promoInfo" data-slide="prev">
                                    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Previous</span>
                                </button>
                                <button class="carousel-control-next" type="button" data-target="#promoInfo" data-slide="next">
                                    <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                    <span class="sr-only">Next</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> <!-- sub kategori-->
            <div style="margin-bottom: 100px;" :class="{'d-none': !(VEDITA_STATUS == constant.VEDITA_STATUS_SUB_CATEGORY)}">
                <div class="sub_category_top_box"> <button class="btn" id="arrowBackBtn" @click="subCategoryBack()"> <img src="img/arrow-back.png" alt="arrow-back" id="arrowBack"> </button> <img src="img/Logo_telkomsel.png" alt="logo telkomsel" id="logoTelkomsel"> </div>
                <div class="sub_category_content">
                    <h1 class="telkomsel-batik-regular">INFORMASI {{ SUB_CATEGORY_TITLE }}</h1>
                </div>
                <div class="sub_category col-12" v-for="sub_category in SHOWN_LIST_SUB_CATEGORY">
                    <div class="row mb-3">
                        <div class="selection_box box-rounded btn text-center btn-block d-flex align-items-center justify-content-center" @click="infoSpeech(sub_category['id'])">
                            <h2 class="sub_category_text telkomsel-batik-regular" style="margin-top: 0;">{{ sub_category['question'] }}</h2>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-center mt-5"> <button class="btn mr-3" :class="{'d-none': SUB_CATEGORY_INDEX == 0}" @click="prevSubCategory()"> <img src="img/arrow-left-red.png" alt="arrow left"> </button>
                    <h4 class="page-circle text-center" :class="{'active': ((SUB_CATEGORY_INDEX + SUB_CATEGORY_PER_PAGE) / SUB_CATEGORY_PER_PAGE  == number)}" v-for="number in range(1, TOTAL_SUB_CATEGORY_PAGE)" :key="number">{{ number }}</h4> <button class="btn" @click="nextSubCategory()" :class="{'d-none': SUB_CATEGORY_INDEX + SHOWN_LIST_SUB_CATEGORY.length >= LIST_SUB_CATEGORY.length - 1}"> <img src="img/arrow-right-red.png" alt="arrow right"> </button>
                </div>
                <div class="sub_category_bottom_box"></div>
            </div>
            <div class="sub_category_bottom_box"></div>
        </div>
    </div> <!-- <div class="d-flex justify-content-center h-100" :class="{'my-align-vertically-center': VEDITA_STATUS != constant.VEDITA_STATUS_IDLE, 'align-items-center': VEDITA_STATUS == constant.VEDITA_STATUS_IDLE, 'd-none': VEDITA_STATUS == constant.VEDITA_STATUS_SUB_CATEGORY}"></div> -->
</template>

<script>
    import constant from '../../config/constant';
    import tts_text from '../../misc/text_to_tts';
    import ClipLoader from 'vue-spinner/src/ClipLoader.vue'
    export default {
        components: {
            ClipLoader,
            name: 'MyComponent'
        },
        data() {
            return {
                VEDITA_STATUS: null,
                IDLE_INTERVAL: null,
                INTERVAL_TIME: 120000,
                constant,
                TTS_TEXT: tts_text.text_to_tts,
                READ_TXT: tts_text.original_text,
                IS_PLAYING: false,
                IS_MODAL_OPEN: false,
                IS_PROMO_MODAL_OPEN: false,
                MODAL_TITLE: '',
                MODAL_TEXT: '',
                IS_MODAL_RECORD_OPEN: false,
                mic_img: '/img/mic-blue.png',
                text_info: 'Klik tombol untuk mulai berbicara',
                LANGUAGE: constant.VEDITA_LANGUAGE_ID,
                AUDIO_CONTEXT: null,
                RECORD: null,
                STREAM: null,
                IS_RECORDING: 0,
                FAQ_IMG: '',
                MODAL_IMG: '',
                LOADING: false,
                LIST_CATEGORY: [],
                LIST_SUB_CATEGORY: [],
                SHOWN_LIST_SUB_CATEGORY: [],
                TOTAL_SUB_CATEGORY_PAGE: 0,
                SUB_CATEGORY_PER_PAGE: 6,
                SUB_CATEGORY_INDEX: 0,
                SUB_CATEGORY_TITLE: '',
                PROMO: [],
                PROMO_URL: ""
            }
        },
        watch: {
            VEDITA_STATUS(newValue, oldValue) {
                this.$refs.mainContainer.classList.remove('welcome-screen')
                if(newValue == constant.VEDITA_STATUS_CATEGORY || newValue == constant.VEDITA_STATUS_SUB_CATEGORY) {
                    document.querySelector('body').classList.add('height-auto')
                }
                else {
                    document.querySelector('body').classList.remove('height-auto')
                }
                if(newValue == constant.VEDITA_STATUS_IDLE) {
                    this.$refs.mainContainer.classList.add('welcome-screen')
                }
                setTimeout(() => {
                    if(newValue == constant.VEDITA_STATUS_IDLE) return
                    this.showBox()
                }, 100)
            }
        },
        mounted() {
            this.loadCategory()
            this.onAudioFinish()
            this.VEDITA_STATUS = this.constant.VEDITA_STATUS_IDLE
        },
        methods: {
            showPromo(id) {
                this.PROMO_URL = `https://10.37.190.192/vedita-show-web?promo_id=${id}`
                this.promoOpenModal()
            },
            prevSubCategory() {
                this.SUB_CATEGORY_INDEX -= 6
                if (this.SUB_CATEGORY_INDEX - 1 < 0) {
                    this.SHOWN_LIST_SUB_CATEGORY = this.LIST_SUB_CATEGORY.slice(this.SUB_CATEGORY_INDEX, this.SUB_CATEGORY_PER_PAGE + this.SUB_CATEGORY_INDEX)
                }
                else {
                    this.SHOWN_LIST_SUB_CATEGORY = this.LIST_SUB_CATEGORY.slice(this.SUB_CATEGORY_INDEX - 1, this.SUB_CATEGORY_PER_PAGE + this.SUB_CATEGORY_INDEX)
                }

            },
            nextSubCategory() {
                this.SUB_CATEGORY_INDEX += 6
                this.SHOWN_LIST_SUB_CATEGORY = this.LIST_SUB_CATEGORY.slice(this.SUB_CATEGORY_INDEX - 1, this.SUB_CATEGORY_PER_PAGE + this.SUB_CATEGORY_INDEX)
            },
            range(start, end) {
                return Array.from({ length: end - start + 1 }, (_, i) => start + i);
            },
            returnHome() {
                this.setIdle()
                this.stopAudio()
            },
            modalOpen() {
                setTimeout(() => {
                    let modal_height = document.querySelector('.modal-lg').offsetHeight
                    if(modal_height > 800) {
                        modal_height += 200
                        document.querySelector('.modal-lg').style.height = `${modal_height}px`
                    }
                }, 100)
            },
            subCategoryBack() {
                this.VEDITA_STATUS = this.constant.VEDITA_STATUS_CATEGORY
            },
            listSubCategory(id_category = null, title = "") {
                if(id_category == null || id_category == false || id_category == "") {
                    return
                }
                this.SUB_CATEGORY_TITLE = title
                this.showLoading()
                // this.VEDITA_STATUS = constant.VEDITA_STATUS_SUB_CATEGORY
                this.$axios.$get(`vedita-cs-list-subcategory?id_category=${id_category}`, {
                    headers: {
                        'x-api-key': process.env.ACCESS_TOKEN
                    }
                }).then((response) => {
                    if(response['status_code'] == 200) {
                        const {data} = response
                        this.LIST_SUB_CATEGORY = data['sub_category']
                        this.VEDITA_STATUS = this.constant.VEDITA_STATUS_SUB_CATEGORY
                        this.TOTAL_SUB_CATEGORY_PAGE = Math.ceil(this.LIST_SUB_CATEGORY.length / 6)
                        this.SHOWN_LIST_SUB_CATEGORY = this.LIST_SUB_CATEGORY.slice(0, this.SUB_CATEGORY_PER_PAGE)
                    }
                    this.hideLoading()
                })
                .catch((error) => {
                    alert(error)
                    this.hideLoading()
                })
            },
            showLoading() {
                this.LOADING = true
            },
            hideLoading() {
                this.LOADING = false;
            },
            setIdle() {
                this.VEDITA_STATUS = constant.VEDITA_STATUS_IDLE
                let all_class = document.querySelectorAll('div.fade-in-div')
                for (let div = 0; div < all_class.length; div++) {
                    all_class[div].classList.remove('show')
                }
            },
            loadAndPlayAudio(objectURL) {
                document.querySelector("#audioPlayer").src = objectURL
                document.querySelector("#audioPlayer").play()
                this.IS_PLAYING = true
            },
            afterRecord(audio_blob) {
                this.showLoading()
                const formData = new FormData()
                formData.append('file', audio_blob, "recorded_audio.wav")
                formData.append("language", this.LANGUAGE)
                formData.append("request_type", "file")
                this.$axios.$post('vedita-speech-recognizer', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-api-key': process.env.ACCESS_TOKEN
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
                        this.hideLoading()
                        const {choices} = result
                        const message = choices[0]['message']['content']
                        const formData = new FormData()
                        formData.append('text', message)
                        formData.append('language', this.LANGUAGE)
                        this.$axios.$post('vedita-tts', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                                'x-api-key': process.env.ACCESS_TOKEN
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
                                this.loadAndPlayAudio(objectURL)
                                
                                // this.VEDITA_STATUS = constant.VEDITA_STATUS_CATEGORY
                                
                                // this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                                this.IS_PLAYING = true
                            }
                        }).catch((error) => {
                            this.hideLoading()
                            // this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                        })
                    })
                    .catch(error => {
                        // Handle errors here
                        this.hideLoading()
                        console.error('Fetch error:', error);
                    });
                })
                .catch((error) => {
                    alert(error)
                    this.hideLoading()
                })
            },
            onMicClick() {
                if(this.IS_PLAYING) {
                    return
                }
                if(this.IS_RECORDING == 0) {
                    this.startRecording()
                }
                else {
                    let callback = this.afterRecord
                    this.stopRecording(callback)
                    this.mic_img = "/img/mic-blue.png"
                    this.text_info = "Klik tombol untuk mulai berbicara"
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
                let selector = 'div.category'
                let prevSelector = 'div.sub_category'
                if(this.VEDITA_STATUS == this.constant.VEDITA_STATUS_SUB_CATEGORY) {
                    selector = 'div.sub_category'
                    prevSelector = 'div.category'
                }
                let all_class = document.querySelectorAll(selector)
                for (let div = 0; div < all_class.length; div++) {
                    await this.sleep(200)
                    all_class[div].classList.add('show')
                }
                all_class = document.querySelectorAll(prevSelector)
                for (let div = 0; div < all_class.length; div++) {
                    all_class[div].classList.remove('show')
                }
            },
            loadCategory() {
                this.showLoading()
                this.$axios.$get('vedita-cs-list-category', {
                    headers: {
                        'x-api-key': process.env.ACCESS_TOKEN
                    }
                }).then((response_category) => {
                    if(response_category['status_code'] == 200) {
                        const {data} = response_category
                        this.LIST_CATEGORY = data['category']
                    }
                    this.hideLoading()
                })
                .catch((error) => {
                    alert(error)
                    this.hideLoading()
                })
            },
            showModal() {
                this.IS_MODAL_OPEN = true;
            },
            showRecordModal() {
                if(this.IS_PLAYING) {
                    return
                }
                this.IS_MODAL_RECORD_OPEN = true;
            },
            closeModal() {
                this.IS_MODAL_OPEN = false;
                this.stopAudio()
            },
            promoOpenModal() {
                this.IS_PROMO_MODAL_OPEN = true;
                this.stopAudio();
            },
            promoCloseModal() {
                this.IS_PROMO_MODAL_OPEN = false;
                this.stopAudio();
            },
            closeRecordModal() {
                this.IS_MODAL_RECORD_OPEN = false;
            },
            infoSpeech(id_sub_category) {
                if(this.IS_PLAYING) {
                    return
                }
                this.showLoading()
                // clearInterval(this.IDLE_INTERVAL)
                this.$axios.$get(`vedita-cs-get-sub-category?id_sub_category=${id_sub_category}&audio_response=true&language=ID`, {
                    headers: {
                        'x-api-key': process.env.ACCESS_TOKEN
                    }
                }).then((response) => {
                    if(response['status_code'] == 200) {
                        const {data} = response
                        this.MODAL_TEXT = data['html_text'].toString()
                        this.hideLoading()
                        this.showModal()
                        this.MODAL_IMG = ""
                        if("b64_faq_img" in data) {
                            const {b64_faq_img} = data
                            const binaryImgData = atob(b64_faq_img)
                            const arrayBuffer = new ArrayBuffer(binaryImgData.length)
                            const view = new Uint8Array(arrayBuffer)
                            for (let i = 0; i < binaryImgData.length; i++) {
                                view[i] = binaryImgData.charCodeAt(i)   
                            }
                            const blob = new Blob([arrayBuffer], {type: 'image/png'})
                            const objectURL = URL.createObjectURL(blob)
                            this.MODAL_IMG = objectURL
                        }
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
                            this.loadAndPlayAudio(objectURL)
                            
                            // this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                            this.IS_PLAYING = true
                        }
                    }
                }).catch((error) => {
                    alert(error)
                    this.hideLoading()
                    // this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                })
            },
            async startRecording() {
                this.STREAM = await navigator.mediaDevices.getUserMedia({audio: true, video: false})
                this.mic_img = "/img/mic-green.png"
                this.text_info = "Klik tombol untuk selesai bicara"
                this.AUDIO_CONTEXT = new AudioContext();
                let input = this.AUDIO_CONTEXT.createMediaStreamSource(this.STREAM);
                this.RECORD = new Recorder(input,{numChannels:1})
                this.RECORD.record()
                this.IS_RECORDING = 1
                console.log("START RECORDING...")
            },
            stopRecording(callback = false) {
                this.RECORD.stop()
                this.STREAM.getAudioTracks()[0].stop()
                this.IS_RECORDING = 0
                if(callback !== false) {
                    this.RECORD.exportWAV(callback)
                }
            },
            triggerVedita() {
                this.showLoading()
                const formData = new FormData()
                formData.append('text', "Halo, Apa ada yang bisa saya bantu? Silakan pilih pertanyaan berikut ini, atau anda juga dapat bertanya dengan klik tombol Pertanyaan Umum Lainnya, dan saya akan menjawab sebisa mungkin")
                this.$axios.$post('vedita-tts', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-api-key': process.env.ACCESS_TOKEN
                    }
                }).then((response) => {
                    this.$axios.$get('vedita-info-promo')
                    .then((response) => {
                        if(response['status_code'] == 200) {
                            this.PROMO = response['data']   
                        }
                    })
                    this.hideLoading()
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
                        this.loadAndPlayAudio(objectURL)
                        
                        this.VEDITA_STATUS = constant.VEDITA_STATUS_CATEGORY
                        
                        // this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                        this.IS_PLAYING = true
                    }
                }).catch((error) => {
                    alert(error)
                    this.hideLoading()
                    // this.IDLE_INTERVAL = setInterval(this.setIdle, this.INTERVAL_TIME)
                })
            }
        }
    }
</script>
<style scoped>

.card.box{
    background-image: url('/img/background.png');
    background-size: cover;   
    width: 100%
}
.my-component {
  background-image: url('/img/background.png');
  background-size: cover; 
  background-position: center;  
  width: 100%;
  
}
.component_mulai{
    background-image: url('/img/mulai_vedita.png');
    background-position: static;  
    height: 30px; 
    position: relative;
    z-index: 2;
}
.image-container {
  position: center;
  width: 100%;
  left: 0%;
}
.image-overlay {
  position: relative;
  left: 25%;
  width: 100%;
  display: inline-block;
  text-align: right; 
}
.image-text {
  position: absolute;
  top: 20%;
  left: 15%;
  border-radius: 5px;
  font-size: 26px;
  color: 	#FFFFFF
}
.card-header img {
    margin-top: 40%; 
}
.image-overlay img {
  display: block;
  width: 100%;
}
.logo{
position: absolute;
  top: 8px;
  right: 16px;
}
.Selamat-datang{
  position: absolute;
  top: 50%;
  right: 10%;
}
.Informasi{
    padding-top: 60px;
    margin-top: 20px;
    text-align: center;
}

.sim-container {
  display: flex;
  padding-top: 20px;
  padding-bottom: 50px;
  justify-content: space-between; 
  align-items: center; 
  flex-wrap: nowrap; }
  
.sim, .roaming, .telkomsel-one {
  display: flex;
  flex-direction: column; 
  align-items: center; 
  text-align: center; 
  margin: 0 10px; 
  padding-left: 15px;
  padding-right: 15px;
}
.sim img, .roaming img, .telkomsel-one img {
  width: 150px; 
  height: 150px; 
}
.selection_box_text {
  margin-top: 5px; 
}
.menu2-container {
  display: flex;
  justify-content: center;
  align-items: center; 
}
.menu2 {
  display: flex;
  flex-direction: column;
  align-items: center; 
  text-align: center; 
  margin: 0 10px;
  margin-right: 50px;
  border-spacing: 50px;
}
.menu2 img {
width: 150px; 
height: 100px; 
}
.icon {
width: 150px; 
height: 100px; 
}
.selection_box_text {
  margin-top: 5px; 
}

.Abu {
    background-image: url("/img/Background-abu.png");
    text-align: center;
    padding-top: 20px;
    position: relative; 
    z-index: 1; 
}
.putih {

    margin-top: 10px;
    background-image: url('/img/background_putih.png');
    width: 100%; 
    height: 425px; 
    position: relative;
    z-index: 2;
}
.layanan-container {
  display: flex;
  padding-top: 20px;
    margin-top: 20px;
  justify-content: space-between; 
  align-items: center; 
  flex-wrap: nowrap; 

}

.info-promo{
  display: flex;
  padding-top: 20px;
  justify-content: space-between; 
  align-items: center; 
  flex-wrap: nowrap; 

}

.orange {
    width: 100%;
    background-image: url('/img/background-orange.png');
    background-size: 100%;
    position: relative;
    z-index: 3;
}
</style>
