import {PeerClient, Components, PeerJSOption} from "../lib/exports";


const options: PeerJSOption = {
    host: process.env.PEER_HOST || '/',
    port: process.env.PEER_PORT || 443,
    path: process.env.PEER_PATH || 'peer-server',
    // debug: 3
};

const peerClient = new PeerClient(options);
Components.init(peerClient);


