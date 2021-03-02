sap.ui.define(
    ["./BaseController"],
    function (BaseController) {
        "use strict";

        return BaseController.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.SortCriteriasDialog", {
            onInit: function () {

            },
            showDialog: function (oHeadlineItem, oCallbackChange) {
                this.oDialog = this.getView().getContent()[0];
                this.oCallbackChange = oCallbackChange;
                this.setModel(new sap.ui.model.json.JSONModel({oHeadlineItem: oHeadlineItem}));
                this.oDialog.open();
            },
            onCloseDialog: function () {
                this.oDialog.close();
            },
            onDown: function (oEvent) {
                const oTable = oEvent.getSource().getParent().getParent();
                const nCurrentIndex = oTable.indexOfItem(oEvent.getSource().getParent());
                const oAllItems = oTable.getItems();
                const oItemChange = oAllItems[nCurrentIndex];
                oTable.removeItem(nCurrentIndex);
                //wenn letztes element, dann on top
                if (nCurrentIndex === oAllItems.length - 1) {
                    oTable.insertItem(oItemChange, 0);
                } else {
                    oTable.insertItem(oItemChange, nCurrentIndex + 1);
                }
            },
            onUp: function (oEvent) {
                const oTable = oEvent.getSource().getParent().getParent();
                const nCurrentIndex = oTable.indexOfItem(oEvent.getSource().getParent());
                const oAllItems = oTable.getItems();
                const oItemChange = oAllItems[nCurrentIndex];
                oTable.removeItem(nCurrentIndex);
                //wenn erstes element, dann on bottom
                if (nCurrentIndex === 0) {
                    oTable.insertItem(oItemChange, oAllItems.length - 1);
                } else {
                    oTable.insertItem(oItemChange, nCurrentIndex - 1);
                }
            },
            onSaveOrder: function () {
                this.oDialog.setBusy(true);
                const oItems = this.getView().byId("tableSortCriterias").getItems();
                const oCriterias = [];
                oItems.forEach(function (oItemTemp, nIndex){
                    const oCriteria = oItemTemp.getBindingContext().getObject();
                    oCriterias.push(oCriteria);
                    const sPath = this.getModel("handoverLayout").createKey("/CriteriaItemSet", {
                        Guid: oCriteria.Guid,
                    });
                    const oUpdate = {
                        SortPosition: nIndex
                    };
                    this.getModel("handoverLayout").update(sPath, oUpdate, {
                        "groupId": "sort"
                    });
                }.bind(this));

                this.getModel("handoverLayout").setDeferredGroups(["sort"]);
                this.getModel("handoverLayout").submitChanges({
                    "groupId": "sort",
                    success: function () {
                        this.oDialog.setBusy(false);
                        this.oDialog.close();
                        if(this.oCallbackChange){
                            this.oCallbackChange(oCriterias);
                        }
                    }.bind(this),
                    error: function () {
                        this.oDialog.setBusy(false);
                    }.bind(this),
                });
            }
        });
    }
);
