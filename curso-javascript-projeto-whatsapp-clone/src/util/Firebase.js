const firebase = require('firebase');
require('firebase/firestore');

export class Firebase {

    constructor() {

        this._config = {
            apiKey: "AIzaSyCwt8YODIpCGaNMwoaiPezdGL9c0jv6Ep0",
            authDomain: "whatsapp-clone-2694c.firebaseapp.com",
            databaseURL: "https://whatsapp-clone-2694c.firebaseio.com",
            projectId: "whatsapp-clone-2694c",
            storageBucket: "whatsapp-clone-2694c.appspot.com",
            messagingSenderId: "591099215441"
        };

        this.init();

    }

    init() {

        if (!this.initialized) {
            firebase.initializeApp(this._config);
            
            firebase.firestore().settings({
                timestampsInSnapshots: true
            });

            this.initialized = true;
        }

    }

    static db() {

        return firebase.firestore();

    }

    static hd() {
        return firebase.storage();
    }

    initAuth() {

        return new Promise((s, f) => {
            
            let provider = new firebase.auth.GoogleAuthProvider();

            firebase.auth().signInWithPopup(provider)
                .then(result => {

                    let token = result.credential.accessToken;
                    let user = result.user;

                    s(user, token);

                })
                .catch(err => {
                    f(err);
                });

        });

    }

}