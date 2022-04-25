sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/Device"], function (JSONModel, Device) {
    "use strict";

    return {
        createDeviceModel() {
            var oModel = new JSONModel(Device);
            oModel.setDefaultBindingMode("OneWay");
            return oModel;
        },

        createFbModel() {
            return new JSONModel({
                Users: [],
                Questions: [],
                AvailableUsers: [],
                ActiveUser: {
                    department: "",
                    isAdmin: false,
                    isAttestationPassed: false,
                    lastAttestationDate: "",
                    mobilePhone: "",
                    name: "",
                    secondName: "",
                    thirdName: "",
                    ticket: ""
                }
            });
        },

        createConfigModel () {
            return new JSONModel({
                editMode: false,

                authData: {
                    name: "",
                    secondName: "",
                    thirdName: ""
                },
            
                newUserData: {
                    department: "",
                    isAdmin: false,
                    lastAttestationDate: "",
                    isAttestationPassed: false,
                    mobilePhone: "",
                    name: "",
                    secondName: "",
                    thirdName: "",
                    ticket: ""
                },

                testResults: [
                    {text: 'Сдано', key: true},
                    {text: 'Не сдано', key: ""}
                ],

                userCashData: {

                },
                
                Departments: []
            });
        },
    };
});
