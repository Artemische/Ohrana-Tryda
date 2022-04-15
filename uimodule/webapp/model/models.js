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
        }
    };
});
