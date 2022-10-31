export default class AppContainer extends HTMLElement {
    connectedCallback() {
        this.showRemote = (remoteId) => {
            if (this.chatContainer)
                this.removeChild(this.chatContainer)
            this.chatContainer = document.createElement("chat-container")
            this.chatContainer.setAttribute("remote-id", remoteId)
            this.appendChild(this.chatContainer)
        }

        myPeerClient.onRemoteCallback = this.showRemote

        this.connectServer = document.createElement("connect-server")
        this.connectServer.onConnect = () => {
            this.innerHTML = ''
            this.sideBar = document.createElement("side-bar")
            this.sideBar.selectItem = this.showRemote
            this.appendChild(this.sideBar)
        }
        this.appendChild(this.connectServer)
    }
}