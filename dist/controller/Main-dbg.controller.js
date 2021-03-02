sap.ui.define(["./BaseController", "sap/m/MessageBox"], function (BaseController, MessageBox) {
    "use strict";

    return BaseController.extend("sap.Beutlhauser.HandOverProtocolEditLayout.controller.Main", {
        /**
         * Called when the worklist controller is instantiated.
         * @public
         */
        onInit: function () {
            this.getRouter()
                .getRoute("RouteMainView")
                .attachPatternMatched(function () {
                    this.getModel("handoverLayout").setDeferredGroups(["own-group"]);
                    this.setModel(
                        new sap.ui.model.json.JSONModel({
                            oConfig: {
                                oSelectedObject: null,
                                oSelectedProductLineItem: null,
                                sUrlHandoverPdf: null,
                            },
                            oCriteriaSet: [],
                            oObjects: []
                        })
                    );
                    this.loadCriterias();
                }, this);
        },
        loadCriterias: function () {
            this.getModel("handoverLayout")
                .read("/CriteriaSet", {
                    success: function (oResponse) {
                        this.getModel().setProperty("/oCriteriaSet", oResponse.results)
                    }.bind(this),
                });
        },
        loadObjects: function (sProdh) {
            this.getView().setBusy(true);
            this.getModel("handoverLayout")
                .read("/RootItemSet", {
                    urlParameters: {
                        $expand: "CriteriaItemSet",
                        $filter: "Prodh eq '" + sProdh + "'"
                    },
                    sorters: [
                        new sap.ui.model.Sorter("SortPosition")
                    ],
                    success: function (oObjects) {
                        const oResult = oObjects.results.map(function (oRootTemp) {
                            oRootTemp.CriteriaItemSet = oRootTemp.CriteriaItemSet.results;
                            return oRootTemp;
                        });
                        this.getModel().setProperty("/oObjects", oResult);
                        this.getView().setBusy(false);
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false);
                        this.showErrorMessage();
                    }.bind(this),
                });
        },
        onClickAddRootItem: function () {
            this.getView().byId("TreeTableObjects").setBusy(true);
            var oObjects = this.getModel().getProperty("/oObjects") || [];
            const sGroupLabel = "Überschrift Neu " + oObjects.length;
            const sProdh = this.getModel().getProperty("/oConfig/oSelectedProductLineItem/Prodh");
            this.getView()
                .getModel("handoverLayout")
                .create(
                    "/RootItemSet",
                    {
                        GroupLabel: sGroupLabel,
                        Prodh: sProdh,
                    },
                    {
                        success: function (oResult) {
                            this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
                            oObjects = oObjects.slice(); //create new Reference
                            oObjects.push({
                                Guid: oResult.Guid,
                                GroupLabel: sGroupLabel,
                                Level: 0,
                                CriteriaItemSet: [],
                            });
                            this.getModel().setProperty("/oObjects", oObjects);
                            this.getView().byId("TreeTableObjects").setBusy(false);
                        }.bind(this),
                        error: function () {
                            this.getView().byId("TreeTableObjects").setBusy(false);
                        }.bind(this),
                    }
                );
        },
        onClickAddCriterium: function () {
            var oObjects = this.getModel().getProperty("/oObjects");
            const oRootItem = this.getModel().getProperty("/oConfig/oSelectedObject").getObject();
            const sCriteriaBezeichnung = "Kriterium Neu " + oRootItem.CriteriaItemSet.length;
            //odata create criteria
            this.getModel("handoverLayout").create(
                "/CriteriaItemSet",
                {
                    RootItemGuid: oRootItem.Guid,
                    Bezeichnung: sCriteriaBezeichnung,
                },
                {
                    success: function (oResult) {
                        this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
                        oRootItem.CriteriaItemSet.push({
                            Guid: oResult.Guid,
                            RootItemGuid: oRootItem.Guid,
                            Bezeichnung: sCriteriaBezeichnung,
                            Level: 1,
                        });
                        oObjects = oObjects.slice(); //create new Reference
                        this.getModel().setProperty("/oObjects", oObjects);
                        this.getView().byId("TreeTableObjects").setBusy(false);
                    }.bind(this),
                    error: function () {
                        this.getView().byId("TreeTableObjects").setBusy(false);
                    }.bind(this),
                }
            );
        },
        onClickDeleteLayout: function () {
            MessageBox.confirm("Layout sicher löschen?", {
                onClose: function (oActionResult) {
                    if (oActionResult != "OK") {
                        return;
                    }

                    this.getView().setBusy(true);
                    const oObjects = this.getModel().getProperty("/oObjects");
                    oObjects.forEach(
                        function (oRootTemp) {
                            if (oRootTemp.Guid) {
                                this.getModel("handoverLayout")
                                    .remove("/RootItemSet(Guid=guid'" + oRootTemp.Guid + "')", {
                                        groupId: "own-group",
                                    });
                            }
                        }.bind(this)
                    );
                    this.getModel("handoverLayout")
                        .submitChanges({
                            groupId: "own-group",
                            success: function () {
                                this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
                                this.getModel().setProperty("/oObjects", []);
                                this.getView().setBusy(false);
                            }.bind(this),
                            error: function () {
                                this.getView().setBusy(false);
                            }.bind(this),
                        });
                    this.getModel().setProperty("/oConfig/oSelectedObject", null);
                }.bind(this),
            });
        },
        onRowSelectionChangeObjects: function (oEvent) {
            const oRowContext = oEvent.getParameter("rowContext");
            if (this.getView().byId("TreeTableObjects").getSelectedIndex() === -1) {
                this.getModel().setProperty("/oConfig/oSelectedObject", null);
            } else {
                this.getModel().setProperty("/oConfig/oSelectedObject", oRowContext);
            }
        },
        isCriteriaAddVisibleFormatter(oSelectedObject) {
            if (oSelectedObject) {
                return oSelectedObject.getProperty("RootItemGuid") == null;
            } else {
                return false;
            }
        },
        isCriteriaSortVisibleFormatter(oSelectedObject) {
            if (oSelectedObject && oSelectedObject.getProperty("RootItemGuid") == null) {
                //Überschrift muss mindestens zwei Kriterien besitzen, sonst macht eine sortierung keinen Sinn
                return oSelectedObject.getProperty("CriteriaItemSet").length >= 2;
            } else {
                return false;
            }
        },
        isCriteriaDeleteVisibleFormatter(oSelectedObject) {
            if (oSelectedObject) {
                return oSelectedObject.getProperty("RootItemGuid") !== null;
            } else {
                return false;
            }
        },
        isLayoutDeleteCopyVisibleFormatter: function (oObjects) {
            if (oObjects && oObjects.length != 0) {
                return true;
            } else {
                return false;
            }
        },
        onValueHelpRequested: function (oEvent) {
            const oSelectProductLineDialogView = this.getOwnerComponent().runAsOwner(function () {
                return new sap.ui.view({
                    viewName: "sap.Beutlhauser.HandOverProtocolEditLayout.view.SelectProductLineForMainDialog",
                    type: sap.ui.core.mvc.ViewType.XML,
                });
            });
            oEvent.getSource().addDependent(oSelectProductLineDialogView); //wichtig, zur aktuell gedrückten Zeile hinzufügen
            oSelectProductLineDialogView.getController().showDialog(
                function (oSelectedProductLineItem) {
                    this.getModel().setProperty("/oConfig/oSelectedProductLineItem", oSelectedProductLineItem);
                    //set pdf url
                    const sServiceUrl = this.getModel("handoverLayout").sServiceUrl;
                    this.getModel()
                        .setProperty("/oConfig/sUrlHandoverPdf", sServiceUrl + "/HandOverPdfSet('" + oSelectedProductLineItem.Prodh + "')/$value");
                    this.loadObjects(oSelectedProductLineItem.Prodh);
                }.bind(this)
            );
        },
        onClickCopyLayout: function (oEvent) {
            const oCopyLayoutDialogView = this.getOwnerComponent().runAsOwner(function () {
                return new sap.ui.view({
                    viewName: "sap.Beutlhauser.HandOverProtocolEditLayout.view.CopyLayoutDialog",
                    type: sap.ui.core.mvc.ViewType.XML,
                });
            });
            oEvent.getSource().addDependent(oCopyLayoutDialogView); //wichtig, zur aktuell gedrückten Zeile hinzufügen
            const sCopyProdh = this.getModel().getProperty("/oConfig/oSelectedProductLineItem/Prodh");
            oCopyLayoutDialogView.getController().showDialog(sCopyProdh);
        },
        onClickCopyHeadline: function (oEvent) {
            const oCopyHeadlineDialogView = this.getOwnerComponent().runAsOwner(function () {
                return new sap.ui.view({
                    viewName: "sap.Beutlhauser.HandOverProtocolEditLayout.view.CopyHeadlineDialog",
                    type: sap.ui.core.mvc.ViewType.XML,
                });
            });
            oEvent.getSource().addDependent(oCopyHeadlineDialogView); //wichtig, zur aktuell gedrückten Zeile hinzufügen
            const oSelectedHeadline = this.getModel().getProperty("/oConfig/oSelectedObject").getObject();
            oCopyHeadlineDialogView.getController().showDialog(oSelectedHeadline);
        },
        onClickDeleteCriteria: function () {
            const oSelectedObject = this.getModel().getProperty("/oConfig/oSelectedObject");
            const sPath = this.getModel("handoverLayout").createKey("/CriteriaItemSet", {
                Guid: oSelectedObject.getObject().Guid,
            });
            MessageBox.confirm("Kriterium sicher löschen?", {
                onClose: function (oActionResult) {
                    if (oActionResult != "OK") {
                        return;
                    }
                    this.getView().byId("TreeTableObjects").setBusy(true);
                    this.getModel("handoverLayout").remove(sPath, {
                        success: function () {
                            this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
                            //delete from table
                            const oObjects = this.getModel().getProperty("/oObjects");
                            const oObjectRoot = oObjects.find(function (oObjectRootTemp) {
                                return oObjectRootTemp.CriteriaItemSet.indexOf(oSelectedObject.getObject()) !== -1;
                            });
                            const nIndexChild = oObjectRoot.CriteriaItemSet.indexOf(oSelectedObject.getObject());
                            oObjectRoot.CriteriaItemSet.splice(nIndexChild, 1);
                            this.getModel().setProperty("/oObjects", oObjects);
                            this.getModel().setProperty("/oConfig/oSelectedObject", null);
                            this.getView().byId("TreeTableObjects").setBusy(false);
                        }.bind(this),
                        error: function () {
                            this.getView().byId("TreeTableObjects").setBusy(false);
                        }.bind(this),
                    });
                }.bind(this),
            });
        },
        onClickDeleteHeadline: function () {
            var oObjects = this.getModel().getProperty("/oObjects");
            const oSelectedObject = this.getModel().getProperty("/oConfig/oSelectedObject");
            const oObjectRoot = oSelectedObject.getObject();
            const nIndexRoot = oObjects.indexOf(oObjectRoot);

            MessageBox.confirm("Überschrift sicher löschen?", {
                onClose: function (oActionResult) {
                    if (oActionResult != "OK") {
                        return;
                    }
                    this.getView().byId("TreeTableObjects").setBusy(true);
                    this.getModel("handoverLayout").remove("/RootItemSet(Guid=guid'" + oObjectRoot.Guid + "')", {
                        success: function () {
                            this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
                            oObjects = oObjects.slice(); //create new Reference
                            oObjects.splice(nIndexRoot, 1);
                            this.getModel().setProperty("/oObjects", oObjects);
                            this.getModel().setProperty("/oConfig/oSelectedObject", null);
                            this.getView().byId("TreeTableObjects").setBusy(false);
                        }.bind(this),
                        error: function () {
                            this.getView().byId("TreeTableObjects").setBusy(false);
                        }.bind(this),
                    });
                }.bind(this),
            });
        },
        onCriteriaChange: function (oEvent, bUpdatePdf) {
            const oCriteria = oEvent.getSource().getBindingContext().getObject();
            this.changeCriteria(oCriteria, bUpdatePdf);
        },
        onChangeGroupLabelRootItem: function (oEvent) {
            this.getView().byId("TreeTableObjects").setBusy(true);
            const oRootItem = oEvent.getSource().getBindingContext().getObject();
            const sPath = this.getModel("handoverLayout").createKey("/RootItemSet", {
                Guid: oRootItem.Guid,
            });
            const oUpdateRootItem = {GroupLabel: oRootItem.GroupLabel, Prodh: oRootItem.Prodh};
            this.getModel("handoverLayout").update(sPath, oUpdateRootItem, {
                success: function () {
                    this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
                    this.getView().byId("TreeTableObjects").setBusy(false);
                }.bind(this),
                error: function () {
                    this.getView().byId("TreeTableObjects").setBusy(false);
                }.bind(this),
            });
        },
        onChangeBezeichnungCriteria: function (oEvent) {
            this.changeCriteria(oEvent.getSource().getBindingContext().getObject());
        },
        changeCriteria: function (oCriteria, bUpdatePdf = true) {
            this.getView().byId("TreeTableObjects").setBusy(true);
            const sPath = this.getModel("handoverLayout").createKey("/CriteriaItemSet", {
                Guid: oCriteria.Guid,
            });
            const oUpdateCriteria = {
                Criteria: oCriteria.Criteria,
                Bezeichnung: oCriteria.Bezeichnung,
                CountImages: oCriteria.CountImages,
                FreeTextRequired: oCriteria.FreeTextRequired
            };
            this.getModel("handoverLayout").update(sPath, oUpdateCriteria, {
                success: function () {
                    if (bUpdatePdf) {
                        this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
                    }
                    this.getView().byId("TreeTableObjects").setBusy(false);
                }.bind(this),
                error: function () {
                    this.getView().byId("TreeTableObjects").setBusy(false);
                }.bind(this),
            });
        },
        onPressCalcImage: function (oEvent) {
            const oCalcBuilderImageDialog = this.getOwnerComponent().runAsOwner(function () {
                return new sap.ui.view({
                    viewName: "sap.Beutlhauser.HandOverProtocolEditLayout.view.CalcBuilderImageDialog",
                    type: sap.ui.core.mvc.ViewType.XML,
                });
            });
            const oSource = oEvent.getSource();
            oSource.addDependent(oCalcBuilderImageDialog); //wichtig, zur aktuell gedrückten Zeile hinzufügen
            const oCriteria = oSource.getBindingContext().getObject();
            oCalcBuilderImageDialog.getController().showDialog(oCriteria, function (sExpression) {
                this.getModel().setProperty("ExpressionImagesAvailable", sExpression, oSource.getBindingContext());
            }.bind(this));
        },
        onPressCalcFreeText: function (oEvent) {
            const oCalcBuilderFreeTextDialog = this.getOwnerComponent().runAsOwner(function () {
                return new sap.ui.view({
                    viewName: "sap.Beutlhauser.HandOverProtocolEditLayout.view.CalcBuilderFreeTextDialog",
                    type: sap.ui.core.mvc.ViewType.XML,
                });
            });
            const oSource = oEvent.getSource();
            oSource.addDependent(oCalcBuilderFreeTextDialog); //wichtig, zur aktuell gedrückten Zeile hinzufügen
            const oCriteria = oSource.getBindingContext().getObject();
            oCalcBuilderFreeTextDialog.getController().showDialog(oCriteria, function (sExpression) {
                this.getModel().setProperty("ExpressionFreeTextAvailable", sExpression, oSource.getBindingContext());
            }.bind(this));
        },
        onClickSortHeadline: function (oEvent) {
            const oSortHeadlineDialog = this.getOwnerComponent().runAsOwner(function () {
                return new sap.ui.view({
                    viewName: "sap.Beutlhauser.HandOverProtocolEditLayout.view.SortHeadlineDialog",
                    type: sap.ui.core.mvc.ViewType.XML,
                });
            });
            const oSource = oEvent.getSource();
            oSource.addDependent(oSortHeadlineDialog); //wichtig, zur aktuell gedrückten Zeile hinzufügen
            oSortHeadlineDialog.getController().showDialog(function (oObjects) {
                this.getModel().setProperty("/oObjects", oObjects);
                this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
            }.bind(this));
        },
        onClickSortCriterias: function (oEvent) {
            const oSortCriteriasDialog = this.getOwnerComponent().runAsOwner(function () {
                return new sap.ui.view({
                    viewName: "sap.Beutlhauser.HandOverProtocolEditLayout.view.SortCriteriasDialog",
                    type: sap.ui.core.mvc.ViewType.XML,
                });
            });
            const oSource = oEvent.getSource();
            oSource.addDependent(oSortCriteriasDialog); //wichtig, zur aktuell gedrückten Zeile hinzufügen
            const oHeadlineItemContext = this.getModel().getProperty("/oConfig/oSelectedObject");
            oSortCriteriasDialog.getController().showDialog(oHeadlineItemContext.getObject(), function (oCriterias) {
                this.getModel().setProperty("CriteriaItemSet", oCriterias, oHeadlineItemContext);
                this.getView().byId("handoverPdfViewer").invalidate(); //refresh pdf
            }.bind(this));
        }
    });
});
