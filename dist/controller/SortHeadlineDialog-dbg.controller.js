sap.ui.define(
    ["./BaseController"],
    function (BaseController) {
        "use strict";

        return BaseController.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.SortHeadlineDialog", {
            onInit: function () {

            },
            showDialog: function (oCallbackChange) {
                this.oDialog = this.getView().getContent()[0];
                this.oCallbackChange = oCallbackChange;
                this.oDialog.open();
            },
            onCloseDialog: function () {
                this.oDialog.close();
            },
            onDown: function () {
                const oTable = this.byId("tableSortHeadline");
                const nCurrentIndex = oTable.indexOfItem(oTable.getSelectedItem());
                oTable.removeSelections();
                const oAllItems = oTable.getItems();
                const oItemChange = oAllItems[nCurrentIndex];
                oTable.removeItem(nCurrentIndex);
                //wenn letztes element, dann on top
                if (nCurrentIndex === oAllItems.length - 1) {
                    oTable.insertItem(oItemChange, 0);
                } else {
                    oTable.insertItem(oItemChange, nCurrentIndex + 1);
                }
                oItemChange.setSelected(true);
            },
            onUp: function () {
                const oTable = this.byId("tableSortHeadline");
                const nCurrentIndex = oTable.indexOfItem(oTable.getSelectedItem());
                oTable.removeSelections();
                const oAllItems = oTable.getItems();
                const oItemChange = oAllItems[nCurrentIndex];
                oTable.removeItem(nCurrentIndex);
                //wenn erstes element, dann on bottom
                if (nCurrentIndex === 0) {
                    oTable.insertItem(oItemChange, oAllItems.length - 1);
                } else {
                    oTable.insertItem(oItemChange, nCurrentIndex - 1);
                }
                oItemChange.setSelected(true);
            },
            onSaveOrder: function () {
                this.oDialog.setBusy(true);
                const oItems = this.getView().byId("tableSortHeadline").getItems();
                const oObjects = [];
                oItems.forEach(function (oItemTemp, nIndex){
                    const oRootItem = oItemTemp.getBindingContext().getObject();
                    oObjects.push(oRootItem);
                    const sPath = this.getModel("handoverLayout").createKey("/RootItemSet", {
                        Guid: oRootItem.Guid,
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
                            this.oCallbackChange(oObjects);
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
