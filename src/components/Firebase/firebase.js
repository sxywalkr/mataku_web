import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const config = {
  apiKey: "AIzaSyBinPikdtORyzy7UR2iuQtrDVUehKin4Yc",
  authDomain: "fbmataku.firebaseapp.com",
  databaseURL: "https://fbmataku.firebaseio.com",
  projectId: "fbmataku",
  storageBucket: "fbmataku.appspot.com",
  messagingSenderId: "519132597723",
  appId: "1:519132597723:web:97369c75bfc4e2da68ebfe",
  measurementId: "G-EFV76KQ12Z"
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();

    this.serverValue = app.database.ServerValue;
  }

  /****AUTH API */
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password);

  // *** Merge Auth and DB User API *** //
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.user(authUser.uid)
          .once('value')
          .then(snapshot => {
            const dbUser = snapshot.val();
            // console.log(dbUser)
            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = []
            }
            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };
            next(authUser);
            // console.log(authUser);
          });
      } else {
        fallback();
      }
    });

  /****USER API */
  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref('users');

  /****ITEM API */
  dbPasien = uid => this.db.ref(`dbPasien/${uid}`);
  dbPasiens = () => this.db.ref('dbPasien');

  /****PRODUK API */
  produk = uid => this.db.ref(`produks/${uid}`);
  produks = () => this.db.ref('produks');

  /****PRODUK API */
  hariancs = uid => this.db.ref(`hariancs/${uid}`);
  hariancss = () => this.db.ref('hariancs');


  // *** Message API ***
  message = uid => this.db.ref(`messages/${uid}`);
  messages = () => this.db.ref('messages');

}

export default Firebase;