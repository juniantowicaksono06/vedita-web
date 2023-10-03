<template>
    <div class="container">
        <div class="d-flex justify-content-center align-items-center h-100">
            <div class="d-flex justify-content-center">
                <div class="card box-rounded">
                    <div class="card-header box-rounded">
                        <div class="d-flex justify-content-center">
                            <img src="/img/logo.png" alt="" class="img-fluid w-50">
                        </div>
                    </div>
                    <div class="card-body box-rounded mt-5">
                        <div class="d-flex justify-content-center">
                            <img :src=mic_img alt="" class="mic-icon"  v-on:click="on_icon_click()">
                        </div>
                        <div class="mt-3">
                            <h4 class="text-center">{{ text_info }}</h4>
                            <div class="mt-3">
                                <audio id="audioPlayer" controls></audio>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Constant from '../../config/constant'
    export default {
        data() {
            return {
                text_info: "Silahkan klik icon untuk mulai merekam",
                mic_img: "/img/mic-blue.png",
                IS_RECORDING: 0,
                VEDITA_STATUS: Constant.VEDITA_STATUS_IDLE,
                // MEDIA_RECORDER: false,
                LANGUAGE: Constant.VEDITA_LANGUAGE_ID,
                AUDIO_CONTEXT: null,
                RECORD: null,
                STREAM: null,
            }
        },
        methods: {
            command(audio_blob) {
                document.querySelector("#audioPlayer").src = URL.createObjectURL(audio_blob)
                document.querySelector("#audioPlayer").controls = true
                document.querySelector("#audioPlayer").autoplay = true
                document.querySelector("#audioPlayer").play()
                const formData = new FormData()
                formData.append('file', audio_blob, "recorded_audio.wav")
                formData.append("language", this.LANGUAGE)
                formData.append("request_type", "file")
                this.$axios.$post('vedita-web-test', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((response) => {
                    if(response.status == "OK") {
                        console.log(response)
                    }
                })
            },
            on_icon_click() {
                console.log(this.IS_RECORDING)
                if(this.IS_RECORDING == 0) {
                    this.IS_RECORDING = 1
                    console.log("START RECORDING...")
                    this.startRecording()
                }
                else {
                    let callback = this.command
                    this.stopRecording(callback)
                    this.IS_RECORDING = 0
                    this.mic_img = "/img/mic-blue.png"
                    this.text_info = "Silahkan klik icon untuk mulai merekam"
                    console.log("STOP RECORDING!")
                }
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
            }
        }
    }
</script>