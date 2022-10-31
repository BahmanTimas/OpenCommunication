export default class CallPage extends HTMLElement {
    connectedCallback() {
        const remoteId = this.getAttribute("remote-id")

        const user = myPeerClient.getUser(remoteId)

        this.smallVideo = document.createElement("video")
        this.smallVideo.className = 'small-video'
        this.smallVideo.autoplay = true
        this.smallVideo.muted = true
        this.smallVideo.srcObject = user.localStream
        this.appendChild(this.smallVideo)

        this.bigVideo = document.createElement("video")
        this.bigVideo.className = 'big-video'
        this.bigVideo.autoplay = true
        this.bigVideo.srcObject = user.remoteStream
        this.appendChild(this.bigVideo)

        this.smallVideo.onclick = () => {
            const tempSrc = this.smallVideo.srcObject;
            this.smallVideo.srcObject = this.bigVideo.srcObject
            this.bigVideo.srcObject = tempSrc

            const tempMuted = this.smallVideo.muted;
            this.smallVideo.muted = this.bigVideo.muted
            this.bigVideo.muted = tempMuted
        }

    }
}