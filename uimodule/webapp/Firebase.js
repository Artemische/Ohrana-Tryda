sap.ui.define([
	"sap/ui/model/json/JSONModel",
    "bntu/ohranaTryda/libs/firebase",
    "bntu/ohranaTryda/libs/database",

], function (JSONModel, firebasejs, databasejs) {
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
            var db = firebase.database();
            var usersRef = db.ref("Users/");

            usersRef.on("value", snapshot => {
                this.handleOnMethodSuccess(snapshot.val());
            }, error => {
                console.log("Error: " + error.code);
            });
            
            return new JSONModel({
                Users: [],
                AvailableUsers: [],
                ActiveUser: {
                    department: "",
                    isAdmin: false,
                    lastAttestationDate: "",
                    lastAttestationResult: "",
                    mobilePhone: "",
                    name: "",
                    secondName: "",
                    thirdName: "",
                },
                Questions: []
            });
		},

        handleOnMethodSuccess(snapshotData) {
            var fbModel = sap.ui.getCore().byId("container-ohranaTryda---idAppControl").getModel();
            fbModel.setProperty("/Users", snapshotData);
        },

        async handleOnceMethod(path) {
            var ref = firebase.database().ref(path);
            var snapshot = await ref.once("value");
            if (snapshot.exists()) {
                return snapshot.val();
            } else {
                console.log("Something went wrong!");
            }
        },

        handleSetMethod(path, doc) {
            var ref = firebase.database().ref(path);
            ref.set(doc);
        },

        handleRemoveMethod(path) {
            var ref = firebase.database().ref(path);
            ref.remove();
        },

        handleUpdateMethod(path, doc) {
            var updates = {};
            var ref = firebase.database().ref();
            updates[path] = doc;
            ref.update(updates);
        }

	};
});