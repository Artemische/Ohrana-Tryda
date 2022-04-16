sap.ui.define([
    "bntu/ohranaTryda/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox",
    "sap/ui/model/Filter", 
    "sap/ui/model/FilterOperator",
], function (Controller, Fragment, MessageBox, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("bntu.ohranaTryda.controller.ObjectPage", {
        
        onInit() {
            this.getRouter().getRoute("RouteOP").attachPatternMatched(this._onRouteMatched, this);
        },

        _onRouteMatched(oEvent) {
            const oArguments = oEvent.getParameter("arguments");
            const aItems = this.getModel().getProperty("/AvailableUsers");
            const sId = oArguments.epmployeId;
            const sIndex = aItems.findIndex( el => el.mobilePhone === +sId );

            this.getView().bindElement({
                path: `/AvailableUsers/${sIndex}`,
            });
        },
    });
});
