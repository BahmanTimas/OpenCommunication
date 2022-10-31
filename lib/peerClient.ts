import {Peer, PeerJSOption} from "peerjs";

interface IUser {
    id: string;
    dataConnection: any;
    callConnection: any;
    chats: any[];
    localStream: any;
    remoteStream: any;
    messageCallback: (data) => void;
}

export class PeerClient {
    public readonly users: Map<string, IUser> = new Map()
    private peer: Peer
    private readonly peerOptions: PeerJSOption

    constructor(options: PeerJSOption) {
        this.peerOptions = options
    }

    public onRemoteCallback: (id: string) => void = id => {
    }

    connectServer(id: string, callBack: (id: string) => void): void {
        this.peer = new Peer(id, this.peerOptions)

        this.peer.on('open', (id) => {
            callBack(id)
        })

        this.peer.on('error', (err) => {
            alert('server connection err:' + err.message);
            console.log(err)
        })

        this.peer.on('connection', (conn) => {
            this.setDataConnection(conn.peer, conn)
            this.onRemoteCallback(conn.peer)
        })

        this.peer.on('call', (conn) => {
            this.setCallConnection(conn.peer, conn)
            this.onRemoteCallback(conn.peer)
        })
    }

    fetchUsers(callBack: (peers: any[]) => void) {
        this.peer.listAllPeers(peers => {

            const index = peers.indexOf(this.peer.id);
            if (index > -1) { // only splice array when item is found
                peers.splice(index, 1); // 2nd parameter means remove one item only
            }

            peers.forEach(peer => {
                this.updateUser(peer, {})
            })
            callBack(peers)
        })
    }

    getUser(remoteId): IUser {
        if (this.users.has(remoteId))
            return this.users.get(remoteId)
        else
            return {
                id: remoteId,
                dataConnection: null,
                callConnection: null,
                chats: [],
                localStream: null,
                remoteStream: null,
                messageCallback: (data) => {
                },
            }
    }

    updateUser(remoteId, update) {
        const user = {
            ...this.getUser(remoteId),
            ...update
        }
        this.users.set(remoteId, user)
    }

    getCallStatus(remoteId) {
        if (this.getUser(remoteId).callConnection) {
            if (this.getUser(remoteId).callConnection.open)
                return 'connected'
            else if (this.getUser(remoteId).localStream)
                return 'calling'
            else
                return 'ringing'
        } else {
            return 'not-connected'
        }
    }

    getChatStatus(remoteId) {
        if (this.getUser(remoteId).dataConnection) {
            if (this.getUser(remoteId).dataConnection.open)
                return 'connected'
            else
                return 'connecting'
        } else
            return 'not-connected'
    }

    chat(remoteId: string, callBack: () => void) {
        const options = {
            label: "chat-connection",
            metadata: {meta: "test"},
            serialization: "binary",
            reliable: true,
        }

        const conn = this.peer.connect(remoteId, options)
        conn.on('open', () => {
            callBack();
        });
        this.setDataConnection(remoteId, conn)
    }

    call(remoteId, stream, callBack) {
        const options = {
            metadata: {meta: "test"},
            // sdpTransform: () => {},
        }

        this.updateUser(remoteId, {localStream: stream})

        const conn = this.peer.call(remoteId, stream, options)
        conn.on('stream', (stream) => {
            this.updateUser(conn.peer, {remoteStream: stream})
            callBack()
        });

        this.setCallConnection(remoteId, conn)

        return conn
    }

    answer(remoteId, stream, callBack) {
        this.updateUser(remoteId, {localStream: stream})
        const conn = this.getUser(remoteId).callConnection
        conn.on('stream', (stream) => {
            this.updateUser(conn.peer, {remoteStream: stream})
            callBack()
        });
        conn.answer(stream)
    }

    closeChat(remoteId) {
        this.getUser(remoteId).dataConnection.close()
        this.updateUser(remoteId, {
            dataConnection: null,
            localStream: null,
            remoteStream: null,
        })
    }

    closeCall(remoteId) {
        this.getUser(remoteId).callConnection.close()
        this.updateUser(remoteId, {
            callConnection: null,
            localStream: null,
            remoteStream: null,
        })
    }

    sendMessage(remoteId, text) {
        const data = {
            sender: this.peer.id,
            receiver: remoteId,
            text: text,
            sendDate: new Date().toString(),
        }
        this.getUser(remoteId).dataConnection.send(data)
        this.addMessageToChat(remoteId, data)
    }

    private addMessageToChat(remoteId, data) {
        data.receiveDate = new Date()
        this.getUser(remoteId).chats.push(data)
        this.getUser(remoteId).messageCallback(data)
    }

    private setDataConnection(remoteId, conn) {
        conn.on('close', () => {
            console.log("connection-closed: " + remoteId)
        })

        conn.on('error', (err) => {
            alert('connection err:' + remoteId);
            console.log(err)
        });

        conn.on('data', (data) => {
            this.addMessageToChat(remoteId, data)
        })

        this.updateUser(remoteId, {dataConnection: conn})
    }

    private setCallConnection(remoteId, conn) {
        conn.on('close', () => {
            console.log("call-closed: " + remoteId)
        })

        conn.on('error', (err) => {
            alert('call err:' + remoteId);
            console.log(err)
        });

        this.updateUser(remoteId, {callConnection: conn})
    }
}