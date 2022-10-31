export default class ChatPage extends HTMLElement {

    messagesContainer

    constructor() {
        super();
    }

    connectedCallback() {
        const remoteId = this.getAttribute("remote-id")
        this.messagesContainer = document.createElement("div")
        this.appendChild(this.messagesContainer)

        this.addMessage = (data) => {
            const item = document.createElement("p")
            item.innerHTML = data.sender + ": " + data.text
            this.messagesContainer.appendChild(item)
        }

        myPeerClient.getUser(remoteId).chats.forEach(this.addMessage)
        myPeerClient.updateUser(remoteId, {messageCallback: this.addMessage})

        this.dataInput = document.createElement("input")
        this.sendBtn = document.createElement("button")
        this.sendBtn.innerHTML = 'send'
        this.sendBtn.onclick = () => {
            myPeerClient.sendMessage(remoteId, this.dataInput.value);
            this.dataInput.value = ''
        }
        this.inputContainer = document.createElement("div")
        this.inputContainer.appendChild(this.dataInput)
        this.inputContainer.appendChild(this.sendBtn)
        this.appendChild(this.inputContainer)
    }

    disconnectedCallback() {
        const remoteId = this.getAttribute("remote-id")
        myPeerClient.updateUser(remoteId, {
            messageCallback: (data) => {}
        })
    }

}