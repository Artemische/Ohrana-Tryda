sap.ui.define([
    "bntu/ohranaTryda/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter", 
	"sap/ui/model/FilterOperator",
], function (Controller, Fragment, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("bntu.ohranaTryda.controller.ListReport", {
        
        onInit() {
            this.openLoginDialog();
        },

        openLoginDialog() {
            const oView = this.getView();

            if (!this.oLoginDialog) {
                this.oLoginDialog = Fragment.load({
                    id: oView.getId(),
                    name: "bntu.ohranaTryda.view.fragments.Login",
                    controller: this
                }).then(oLoginDialog => {
                    oView.addDependent(oLoginDialog);
                    return oLoginDialog;
                });
            }
            this.oLoginDialog.then(oLoginDialog => {
                oLoginDialog.open();
            });
        },

        onCancelPress() {
            this.closeLoginDialog();
        },

        closeLoginDialog() {
            if (this.oLoginDialog) {
                this.oLoginDialog.then(oLoginDialog => {
                    oLoginDialog.close().destroy();
                    this.oLoginDialog = null;
                });
            }
        },

        onSignInPress() {
            const sName = this.byId("loginFirstNameId").getValue();
            const sSecondName = this.byId("loginSecondNameId").getValue();
            const sThirdName = this.byId("loginThirdNameId").getValue();
            const oLoginCredentials = {
                name: sName,
                secondName: sSecondName,
                thirdName: sThirdName
            };
            this._authenticateUser(oLoginCredentials);
        },

        onFilterChange() {
            const aFilterItems = this.byId("filterbar").getFilterItems();
            const aFilters = [];

            aFilterItems.forEach( item => {
                const oControl = item.getControl();
                const sValue = oControl.getValue ? oControl.getValue() : oControl.getSelectedKey();

                if (sValue) {
                    aFilters.push(new Filter(oControl.data("prop"), FilterOperator.Contains, sValue));
                }
            });
            
            this.byId("idProductsTable").getBinding("items").filter(aFilters);
        },

        _authenticateUser(oLoginCredentials) {
            const oModel = this.getModel();
            const oExistingUser = this._verifyLoginUserExist(oLoginCredentials);

            if (oExistingUser) {
                oModel.setProperty("/ActiveUser", oExistingUser);
                this._setAvailableUsers();
                this.closeLoginDialog();
            } else {
                debugger
                // handle user doesn't exist
            }
        },

        _setAvailableUsers() {
            const oModel = this.getModel();
            const bActiveUserIsAdmin = oModel.getProperty("/ActiveUser/isAdmin");
            const sProperty = bActiveUserIsAdmin ? "/Users" : "/ActiveUser";

            oModel.setProperty("/AvailableUsers", [].concat(oModel.getProperty(sProperty)));
        },

        _verifyLoginUserExist(oLoginUser) {
            const oFbWsResponseModel = this.getModel();
            const oUsers = oFbWsResponseModel.getData().Users;

            return oUsers.find(oUser => oUser.name.toLowerCase() === oLoginUser.name.toLowerCase() && 
                oUser.secondName.toLowerCase() === oLoginUser.secondName.toLowerCase() &&
                oUser.thirdName.toLowerCase() === oLoginUser.thirdName.toLowerCase());

        },
    });
});
