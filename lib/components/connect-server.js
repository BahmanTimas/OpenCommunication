export default class ConnectServer extends HTMLElement {
    connectedCallback() {

        this.connect_header = document.createElement("h1")
        this.connect_header.innerHTML = "Get Online!!!"
        this.id_input = document.createElement("input")
        this.id_input.placeholder = "Enter Your ID"
        this.connect_btn = document.createElement("button")
        this.connect_btn.innerHTML = "Connect to Server"
        this.connect_btn.style.margin = "16px"
        this.connect_btn.onclick = () =>
            myPeerClient.connectServer(this.id_input.value, this.onConnect)

        this.appendChild(this.connect_header)
        this.appendChild(this.id_input)
        this.appendChild(this.connect_btn)
    }
}