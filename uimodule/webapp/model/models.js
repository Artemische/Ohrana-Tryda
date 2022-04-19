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
                }
            });
        },

        createConfigModel () {
            return new JSONModel({
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
                    thirdName: ""
                },
                
                Departments: []
            });
        },
    };
});
