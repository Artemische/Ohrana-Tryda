sap.ui.define([
    "bntu/ohranaTryda/controller/BaseController",
    "sap/ui/core/Fragment",
], function (Controller, Fragment) {
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
            if (this.oLoginDialog) {
                this.oLoginDialog.then(oLoginDialog => {
                    oLoginDialog.close().destroy();
                    this.oLoginDialog = null;
                });
            }
        },

        onSignInPress() {
            const oActiveUser = this.getView().getModel().getProperty("/ActiveUser");
            const oLoginCredentials = {
                name: oActiveUser.name,
                secondName: oActiveUser.secondName,
                thirdName: oActiveUser.thirdName
            };
            this._authenticateUser(oLoginCredentials);
        },

        _authenticateUser(oLoginCredentials) {
            const oLocalModel = this.getView().getModel();
            const oExistingUser = this._verifyLoginUserExist(oLoginCredentials);
            if (oExistingUser) {
                oLocalModel.setProperty("/ActiveUser", oExistingUser);
                this._setAvailableUsers();
            } else {
                debugger
                // handle user doesn't exist
            }
        },

        _setAvailableUsers() {
            const oLocalModel = this.getView().getModel();
            const bActiveUserIsAdmin = oLocalModel.getProperty("/ActiveUser/isAdmin");
            if (bActiveUserIsAdmin) {
                oLocalModel.setProperty("/AvailableUsers", oLocalModel.getProperty("/Users"));
            } else {
                oLocalModel.setProperty("/AvailableUsers", oLocalModel.getProperty("/ActiveUser"));
            }
        },

        _verifyLoginUserExist(oLoginUser) {
            const oFbWsResponseModel = this.getView().getModel();
            const oUsers = oFbWsResponseModel.getData().Users;
            return oUsers.find(oUser => oUser.name.toLowerCase() === oLoginUser.name.toLowerCase() && 
                               oUser.secondName.toLowerCase() === oLoginUser.secondName.toLowerCase() &&
                               oUser.thirdName.toLowerCase() === oLoginUser.thirdName.toLowerCase());

        },
    });
});
