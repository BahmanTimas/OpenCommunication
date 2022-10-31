export default class SideBar extends HTMLElement {
    connectedCallback() {

        this.refresh = () => {
            myPeerClient.fetchUsers(peers => {
                this.list.innerHTML = '';
                peers.forEach((peer) => {
                    const item = document.createElement("li")
                    item.onclick = () => this.selectItem(peer)
                    item.innerHTML = (peer.length > 11) ? peer.slice(0, 8) + '&hellip;' : peer;
                    item.title = peer
                    this.list.appendChild(item)
                })
            });
        }

        this.user_name_header = document.createElement("h2")
        this.user_name_header.innerHTML = "ID: " + myPeerClient.peer.id
        this.appendChild(this.user_name_header)

        this.list_header = document.createElement("h3")
        this.list_header.innerHTML = "Users:"
        this.list_header.style.display = "inline"
        this.appendChild(this.list_header)

        this.refresh_btn = document.createElement("button")
        this.refresh_btn.innerHTML = "refresh"
        this.refresh_btn.onclick = this.refresh
        this.appendChild(this.refresh_btn)

        this.list = document.createElement("ul")
        this.list.innerHTML = "empty"
        this.appendChild(this.list)

        this.refreshLoop = () => {
            setTimeout(() => {
                this.refresh()
                this.refreshLoop()
            }, 10000)
        }

        this.refresh()
        this.refreshLoop()
    }
}