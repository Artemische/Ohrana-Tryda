sap.ui.define([
    "sap/ui/model/json/JSONModel",
    "bntu/ohranaTryda/controller/BaseController",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
], function (JSONModel, Controller, Fragment, MessageBox) {
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

            this._resetCredentialsModel();
        },

        onSignInPress() {
            var sName = this.byId("loginFirstNameId").getValue();
            var sSecondName = this.byId("loginSecondNameId").getValue();
            var sThirdName = this.byId("loginThirdNameId").getValue();
            const oLoginCredentials = {
                name: sName,
                secondName: sSecondName,
                thirdName: sThirdName
            };
            this._authenticateUser(oLoginCredentials);
        },

        handleLoginException() {
            const sTitle = this.getResourceBundle().getText("loginErrorTitle");
            const sErrorMessage = this.getResourceBundle().getText("loginErrorText");

            MessageBox.error(sErrorMessage, {
                title: sTitle,
                onClose: () => {
                    this._resetCredentialsModel();
                }
            })
        },

        _authenticateUser(oLoginCredentials) {
            const oModel = this.getModel();
            const oExistingUser = this._verifyLoginUserExist(oLoginCredentials);

            if (oExistingUser) {
                oModel.setProperty("/ActiveUser", oExistingUser);
                this._setAvailableUsers();
                this.closeLoginDialog();
            } else {
                this.handleLoginException();
            }
        },

        _setAvailableUsers() {
            const oModel = this.getModel();
            const bActiveUserIsAdmin = oModel.getProperty("/ActiveUser/isAdmin");
            const sProperty = bActiveUserIsAdmin ? "/Users" : "/ActiveUser";

            oModel.setProperty("/AvailableUsers", [].concat(oModel.getProperty(sProperty)));
        },

        _verifyLoginUserExist(oLoginUser) {
            const oModel = this.getModel();
            const oUsers = oModel.getData().Users;

            return oUsers.find(oUser => oUser.name.toLowerCase() === oLoginUser.name.toLowerCase() && 
                               oUser.secondName.toLowerCase() === oLoginUser.secondName.toLowerCase() &&
                               oUser.thirdName.toLowerCase() === oLoginUser.thirdName.toLowerCase());

        },

        _resetCredentialsModel() {
            this.byId("loginFirstNameId").setValue("");
            this.byId("loginSecondNameId").setValue("");
            this.byId("loginThirdNameId").setValue("");
        },
    });
});
