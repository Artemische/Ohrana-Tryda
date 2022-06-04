sap.ui.define([
    "bntu/ohranaTryda/controller/BaseController",
    "sap/m/MessageBox"
], function (Controller, MessageBox) {
    "use strict";

    return Controller.extend("bntu.ohranaTryda.controller.ObjectPage", {
        
        onInit() {
            this.getRouter().getRoute("RouteOP").attachPatternMatched(this._onRouteMatched, this);
        },

        async _onRouteMatched(oEvent) {
            const oArguments = oEvent.getParameter("arguments");
            const sId = oArguments.employeeId;
            let aItems;
            let sIndex;

            await this._authorizeUser();
            
            aItems = this.getModel().getProperty("/AvailableUsers");
            sIndex = aItems.findIndex(oElem => oElem.mobilePhone.toString() === sId );

            this.sId= sId;
            this.getView().bindElement({
                path: `/AvailableUsers/${sIndex}`
            });

            this.byId("container-ohranaTryda---pageOP--atestationWizard-progressNavigator").setBlocked(true);
            this.byId("wizardNavContainer").to(this.byId("wizardBranchingReviewPage"));
        },

        navigateToTheListReport() {
            this.getRouter().navTo("RouteMainView");
        },

        /**
         * Handle the click event for the breadcrumb and routes to the employees listing page.
         * 
         * @public
         */
        onListEmployeesBreadcrumbsPress() {
            this.navigateToTheListReport();
        },

        onEditPress() {
            const oConfigModel = this.getModel("configModel");
            const oUserData = {
                ...this.getView().getBindingContext().getObject()
            };

            oConfigModel.setProperty("/userCashData", oUserData);
            oConfigModel.setProperty("/editMode", true);
        },

        onFooterActionPress(oEvent, bCancel) {
            const oConfigModel = this.getModel("configModel");
            const aUsers = this.getModel().getProperty("/Users");
            const sSelectedUserId = this._getSelectedUserId(aUsers);
            const oCtx = this.getView().getBindingContext();

            if (bCancel) {
                const sPath = oCtx.getPath();
                
                this.getModel().setProperty(sPath, oConfigModel.getProperty("/userCashData"));
            } else {
                const oUser = oCtx.getObject();

                this.updateBaseRequest(`Users/${sSelectedUserId}`, oUser);
            }

            oConfigModel.setProperty("/editMode", false);
        },

        onDeletePress() {
            const sWarningMessage = this.getResourceBundle().getText("deleteUserText");
            const sWarningTitle = this.getResourceBundle().getText("deleteUserTitle");
            const sDeleteAction = this.getResourceBundle().getText("deleteAction");
            const sCancelAction = this.getResourceBundle().getText("cancelAction");

            MessageBox.warning(sWarningMessage, {
                title: sWarningTitle,
                actions: [sDeleteAction, sCancelAction],
                onClose: (action) => {
                    action === sDeleteAction ? this.deleteUser() : null;
                }
            })
        },

        onStartTestConfirmation() {
            const sTitle = this.getResourceBundle().getText("titleConfirmMsg");
            const sText = this.getResourceBundle().getText("textConfirmMsg");
            const sYesMessage = this.getResourceBundle().getText("yesMsg");
            const sNoMessage = this.getResourceBundle().getText("noMsg");

            MessageBox.confirm(sText, {
                title: sTitle,
                actions: [sYesMessage, sNoMessage],
                onClose: (sAction) => {
                    if(sAction === sYesMessage) { this.onStartTest() }
                }
            });
        },

        async deleteUser() {
            const aUsers = this.getModel().getProperty("/Users");
            const sSelectedUserId = this._getSelectedUserId(aUsers);
            const sSuccessMessage = this.getResourceBundle().getText("successUserDeletionMsg");
            const sSuccessTitle = this.getResourceBundle().getText("successUserDeletionTitle");

            await this.deleteBaseRequest(`Users/${sSelectedUserId}`);
            MessageBox.success(sSuccessMessage, {
                title: sSuccessTitle,
                onClose: () => {
                    this.navigateToTheListReport();
                }
            });
        },

        onResultChange(oEvent) {
            const oModel = this.getModel();
            const oSelectedItem = oEvent.getSource().getSelectedItem();
            const bKey = oSelectedItem.getBindingContext("configModel").getObject().key;
            const sPath = this.getView().getBindingContext().getPath();
            
            oModel.setProperty(`${sPath}/isAttestationPassed`, bKey);
        },
        
        _getSelectedUserId(oUsers) {
            return Object.entries(oUsers).find(([key, value]) => value.mobilePhone.toString() === this.sId)[0];
        },

        async _authorizeUser() {
            const oModel = this.getModel();
            const oUsers = await this.readBaseRequest("Users/");
            const sActiveUserMobile = sessionStorage.getItem("ActiveUserMobile");
            const oActiveUser = Object.values(oUsers).find(user => user.mobilePhone == sActiveUserMobile);

            if (oActiveUser) {
                oModel.setProperty("/ActiveUser", oActiveUser);
                this._setAvailableUsers();  
            }
        },

        async onStartTest() {
            const iTicketNumber = +this.getView().getBindingContext().getObject().ticket;
            const aTickets = await this.readBaseRequest("Questions/");
            
            this.getModel().setProperty("/Questions", 
                aTickets.filter(ticket => ticket.ticketId == iTicketNumber).sort((a, b) => a.numberInTicket - b.numberInTicket)
            );
            this.byId("wizardNavContainer").to(this.byId("wizardContentPage"));
        },

        async onStartTestAgain() {
            const iTicketNumber = +this.getView().getBindingContext().getObject().ticket;
            const aTickets = await this.readBaseRequest("Questions/");
            
            this.getModel().setProperty("/Questions", 
                aTickets.filter(ticket => ticket.ticketId == iTicketNumber).sort((a, b) => a.numberInTicket - b.numberInTicket)
            );
            this.byId("wizardNavContainer").to(this.byId("wizardContentPage"));
        },

        onNextStep() {
            this.byId("container-ohranaTryda---pageOP--atestationWizard").nextStep();
        },

        onCompleteTest() {
            const aResults = this.byId("atestationWizard").getSteps().map(step => step.getContent()[0].getItems()[0].getSelectedButton().getBindingContext().getObject().isCorrect);
            const bResult = aResults.filter(el => el).length >= 4;
            const oDate = new Date();
            const sAttestationDate = `${oDate.getDate()}.${oDate.getMonth()}.${oDate.getFullYear()}`;

            this.getModel().setProperty(`${this.getView().getBindingContext().getPath()}/isAttestationPassed`, bResult);
            this.getModel().setProperty(`${this.getView().getBindingContext().getPath()}/lastAttestationDate`, sAttestationDate);
            this.onFooterActionPress(null, null);
            this.byId("atestationWizard").getSteps()[0].getContent()[0].getItems()[0].getSelectedButton().getBindingContext().getObject().isCorrect
            this.byId("wizardNavContainer").to(this.byId("reviewResults"));
        },

        onExit() {
            this._logoutCurrentUser();
            this.navigateToTheListReport();
        },

        _logoutCurrentUser() {
            this.getModel().setProperty("/ActiveUser", {});
            this.getModel().setProperty("/AvailableUsers", []);
            sessionStorage.removeItem("ActiveUserMobile");
        }

    });
});
