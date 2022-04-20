sap.ui.define([
    "bntu/ohranaTryda/libs/firebase",
    "bntu/ohranaTryda/libs/database",

], function (firebasejs, databasejs) {
	"use strict";
	// Firebase-config retrieved from the Firebase-console
	const firebaseConfig = {
        apiKey: "AIzaSyD2JsIM-dmZWZL78YUK5vTNypT1lPigcx4",
        authDomain: "safety-test-44229.firebaseapp.com",
        databaseURL: "https://safety-test-44229-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "safety-test-44229",
        storageBucket: "safety-test-44229.appspot.com",
        messagingSenderId: "683542026059",
        appId: "1:683542026059:web:a7023d1532c01ae8d63ace",
        measurementId: "G-FRN9R46BM5"
    };

	return {

		initializeFirebase() {
			firebase.initializeApp(firebaseConfig);
            const db = firebase.database();
            const usersRef = db.ref("Users/");

            usersRef.on("value", snapshot => {
                this.handleOnMethodSuccess(snapshot.val());
            }, error => {

            });
		},

        handleOnMethodSuccess(snapshotData) {
            const fbModel = sap.ui.getCore().byId("container-ohranaTryda---idAppControl").getModel();
            const users = snapshotData;

            fbModel.setProperty("/Users", users);
        },

        async handleOnceMethod(path) {
            const ref = firebase.database().ref(path);
            const snapshot = await ref.once("value");

            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("Something went wrong!");
            }
        },

        handleSetMethod(path, doc) {
            return firebase.database().ref(path).push().set(doc);
        },

        handleRemoveMethod(path) {
            return firebase.database().ref(path).remove();
        },

        handleUpdateMethod(path, doc) {
            const updates = {};
            const ref = firebase.database().ref();
            
            updates[path] = doc;
            ref.update(updates);
        }

	};
});