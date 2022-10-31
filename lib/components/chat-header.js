export default class ChatHeader extends HTMLElement {
    connectedCallback() {
        const remoteId = this.getAttribute("remote-id")
        this.id_header = document.createElement("h1")
        this.id_header.innerHTML = remoteId
        this.id_header.style.display = "inline"
        this.appendChild(this.id_header)

        const callStatus = myPeerClient.getCallStatus(remoteId)
        if (callStatus === 'not-connected') {
            this.button = document.createElement("button")
            this.button.innerHTML = 'call'
            this.button.onclick = this.call
            this.appendChild(this.button)
        } else if (callStatus === 'ringing') {
            this.button = document.createElement("button")
            this.button.innerHTML = 'answer'
            this.button.onclick = this.answer
            this.appendChild(this.button)
        } else if (callStatus === 'connected') {
            this.button = document.createElement("button")
            this.button.innerHTML = 'end call'
            this.button.onclick = this.end
            this.appendChild(this.button)
        }


        const chatStatus = myPeerClient.getChatStatus(remoteId)
        if (chatStatus === 'not-connected') {
            this.button = document.createElement("button")
            this.button.innerHTML = 'connect to chat'
            this.button.onclick = this.connect
            this.appendChild(this.button)
        } else if (chatStatus === 'connected') {
            this.button = document.createElement("button")
            this.button.innerHTML = 'close chat'
            this.button.onclick = this.close
            this.appendChild(this.button)
        }
    }
}