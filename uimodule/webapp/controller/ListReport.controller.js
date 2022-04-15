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
            const oActiveUser = this.getModel().getProperty("/ActiveUser");
            const oLoginCredentials = {
                name: oActiveUser.name,
                secondName: oActiveUser.secondName,
                thirdName: oActiveUser.thirdName
            };

            this._authenticateUser(oLoginCredentials);
        },

        _authenticateUser(oLoginCredentials) {
            const oModel = this.getModel();
            const oExistingUser = this._verifyLoginUserExist(oLoginCredentials);

            if (oExistingUser) {
                oModel.setProperty("/ActiveUser", oExistingUser);
                this._setAvailableUsers();
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
