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
                    email: "",
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
                    secondName: "",
                    mobilePhone: ""
                },
            
                newUserData: {
                    department: "",
                    email: "",
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
                    {text: 'Не сдано', key: false}
                ],

                userCashData: {

                },
                
                Departments: []
            });
        },
    };
});
