import AppContainer from "./components/app-container";
import ConnectServer from "./components/connect-server";
import SideBar from "./components/side-bar";
import ChatContainer from "./components/chat-container";
import ChatHeader from "./components/chat-header";
import ChatPage from "./components/chat-page";
import CallPage from "./components/call-page";

export default class Components {
    static init(client) {
        (<any>window).myPeerClient = client
        window.customElements.define('app-container', AppContainer);
        window.customElements.define('connect-server', ConnectServer);
        window.customElements.define('chat-container', ChatContainer);
        window.customElements.define('chat-header', ChatHeader);
        window.customElements.define('chat-page', ChatPage);
        window.customElements.define('call-page', CallPage);
        window.customElements.define('side-bar', SideBar);
    }
}

