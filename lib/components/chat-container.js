export default class ChatContainer extends HTMLElement {
    connectedCallback() {
        const remoteId = this.getAttribute("remote-id")

        this.getMedia = (callBack) => {
            if (confirm("yes: cam, no: display"))
                navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                    audio: true
                }).then(callBack)
            else
                navigator.mediaDevices.getDisplayMedia({
                    video: true,
                    audio: true
                }).then(callBack)
        }

        this.call = () => {
            this.getMedia(stream => {
                this.showSampleVideo(stream)
                myPeerClient.call(remoteId, stream, this.reloadPage)
            })
        }

        this.answer = () => {
            this.getMedia(stream => {
                myPeerClient.answer(remoteId, stream, this.reloadPage)
            })
        }

        this.end = () => {
            myPeerClient.closeCall(remoteId)
            this.reloadPage()
        }

        this.close = () => {
            myPeerClient.closeChat(remoteId)
            this.reloadPage()
        }

        this.connect = () => myPeerClient.chat(remoteId, this.reloadPage);

        this.showHeader = () => {
            this.chat_header = document.createElement("chat-header")
            this.chat_header.setAttribute("remote-id", remoteId)
            this.chat_header.call = this.call
            this.chat_header.answer = this.answer
            this.chat_header.end = this.end
            this.chat_header.connect = this.connect
            this.chat_header.close = this.close
            this.appendChild(this.chat_header)
        }

        this.showSampleVideo = (stream) => {
            this.localVideo = document.createElement("video")
            this.localVideo.className = "sample-video"
            this.localVideo.autoplay = true
            this.localVideo.srcObject = stream
            this.appendChild(this.localVideo)
        }

        this.showCallPage = () => {
            this.innerHTML = ''
            this.showHeader(remoteId)
            this.callPage = document.createElement("call-page")
            this.callPage.setAttribute("remote-id", remoteId)
            this.appendChild(this.callPage)
        }

        this.showChatPage = () => {
            this.chatPage = document.createElement("chat-page")
            this.chatPage.setAttribute("remote-id", remoteId)
            this.appendChild(this.chatPage)
        }

        this.reloadPage = () => {
            this.innerHTML = ''
            this.showHeader()
            if (myPeerClient.getCallStatus(remoteId) === 'connected')
                this.showCallPage()
            if (myPeerClient.getChatStatus(remoteId) !== 'not-connected')
                this.showChatPage()
        }

        this.reloadPage()
    }
}