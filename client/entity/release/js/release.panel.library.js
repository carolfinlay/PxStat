/*******************************************************************************
Custom JS application specific
*******************************************************************************/
//#region Add Namespace
app.release = app.release || {};

app.release.panel = {};
app.release.panel.workInProgress = {};
app.release.panel.workInProgress.ajax = {};
app.release.panel.workInProgress.callback = {};

app.release.panel.awaitingResponse = {};
app.release.panel.awaitingResponse.ajax = {};
app.release.panel.awaitingResponse.callback = {};

app.release.panel.awaitingSignoff = {};
app.release.panel.awaitingSignoff.ajax = {};
app.release.panel.awaitingSignoff.callback = {};
//#endregion

//#region Read workInProgress
/**
*Call Ajax for read
*/
app.release.panel.workInProgress.ajax.read = function () {
    api.ajax.jsonrpc.request(
        app.config.url.api.private,
        "PxStat.Workflow.Workflow_API.ReadWorkInProgress",
        null,
        "app.release.panel.workInProgress.callback.read");
};

/**
 * Callback for read
 * @param {*} response
 */
app.release.panel.workInProgress.callback.read = function (response) {
    if (response.error) {
        app.release.panel.workInProgress.callback.drawDatatable();
        api.modal.error(response.error.message);
    } else if (response.data !== undefined) {
        app.release.panel.workInProgress.callback.drawDataTable(response.data);
    }
    // Handle Exception
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
 * Draw Callback for Datatable
 */
app.release.panel.drawCallbackWorkInProgress = function () {
    $('[data-toggle="tooltip"]').tooltip();

    //Edit link click
    $("#release-panel-workinprogress table").find("[name=" + C_APP_NAME_LINK_EDIT + "]").once("click", function (e) {
        e.preventDefault();
        //Remove tool tip after click at "[name=" + C_APP_NAME_LINK_EDIT + "]" link.
        $('.tooltip').remove();

        app.release.goTo.load($(this).attr("MtrCode"), $(this).attr("idn"));
    });
}

/**
 * Populate Data Table data
 * @param {*} data
 */
app.release.panel.workInProgress.callback.drawDataTable = function (data) {
    if ($.fn.dataTable.isDataTable("#release-panel-workinprogress table")) {
        app.library.datatable.reDraw("#release-panel-workinprogress table", data);
    } else {

        var localOptions = {
            data: data,
            columns: [
                {
                    data: null,
                    render: function (data, type, row) {
                        var attributes = { idn: row.RlsCode, MtrCode: row.MtrCode };
                        return app.library.html.link.edit(attributes, row.MtrCode);
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return $("<span>", {
                            "data-toggle": "tooltip",
                            "text": row.GrpCode,
                            "title": row.GrpName
                        }).get(0).outerHTML;
                    }
                }
            ],
            order: [0, 'asc'],
            drawCallback: function (settings) {
                app.release.panel.drawCallbackWorkInProgress();
            },
            //Translate labels language
            language: app.label.plugin.datatable
        };
        $("#release-panel-workinprogress table").DataTable(jQuery.extend({}, app.config.plugin.datatable, localOptions)).on('responsive-display', function (e, datatable, row, showHide, update) {
            app.release.panel.drawCallbackWorkInProgress();
        });
    }
};
//#endregion

//#region Read awaitingResponse

/**
*Call Ajax for read
*/
app.release.panel.awaitingResponse.ajax.read = function () {
    api.ajax.jsonrpc.request(
        app.config.url.api.private,
        "PxStat.Workflow.Workflow_API.ReadAwaitingResponse",
        null,
        "app.release.panel.awaitingResponse.callback.read");
};

/**
 * Callback for read
 * @param {*} response
 */
app.release.panel.awaitingResponse.callback.read = function (response) {
    if (response.error) {
        app.release.panel.awaitingResponse.callback.drawDatatable();
        api.modal.error(response.error.message);
    } else if (response.data !== undefined) {
        app.release.panel.awaitingResponse.callback.drawDataTable(response.data);
    }
    // Handle Exception
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
 * Draw Callback for Datatable
 */
app.release.panel.drawCallbackAwaitingResponse = function () {
    $('[data-toggle="tooltip"]').tooltip();

    //Edit link click
    $("#release-panel-awaitingresponse table").find("[name=" + C_APP_NAME_LINK_EDIT + "]").once("click", function (e) {
        e.preventDefault();
        //Remove tool tip after click at "[name=" + C_APP_NAME_LINK_EDIT + "]" link.
        $('.tooltip').remove();

        app.release.goTo.load($(this).attr("MtrCode"), $(this).attr("idn"));
    });
}

/**
 * Populate Data Table data
 * @param {*} data
 */
app.release.panel.awaitingResponse.callback.drawDataTable = function (data) {
    if ($.fn.dataTable.isDataTable("#release-panel-awaitingresponse table")) {
        app.library.datatable.reDraw("#release-panel-awaitingresponse table", data);
    } else {

        var localOptions = {
            data: data,
            columns: [
                {
                    data: null,
                    render: function (data, type, row) {
                        var attributes = { idn: row.RlsCode, MtrCode: row.MtrCode };
                        return app.library.html.link.edit(attributes, row.MtrCode);
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return $("<span>", {
                            "data-toggle": "tooltip",
                            "text": row.GrpCode,
                            "title": row.GrpName
                        }).get(0).outerHTML;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return app.label.static[row.RqsValue]
                    }
                }
            ],
            order: [0, 'asc'],
            drawCallback: function (settings) {
                app.release.panel.drawCallbackAwaitingResponse();

            },
            //Translate labels language
            language: app.label.plugin.datatable
        };

        $("#release-panel-awaitingresponse table").DataTable(jQuery.extend({}, app.config.plugin.datatable, localOptions)).on('responsive-display', function (e, datatable, row, showHide, update) {
            app.release.panel.drawCallbackAwaitingResponse();
        });
    }
};
//#endregion

//#region Read awaitingSignoff

/**
*Call Ajax for read
*/
app.release.panel.awaitingSignoff.ajax.read = function () {
    api.ajax.jsonrpc.request(
        app.config.url.api.private,
        "PxStat.Workflow.Workflow_API.ReadAwaitingSignoff",
        null,
        "app.release.panel.awaitingSignoff.callback.read");
};

/**
 * Callback for read
 * @param {*} response
 */
app.release.panel.awaitingSignoff.callback.read = function (response) {
    if (response.error) {
        app.release.panel.awaitingSignoff.callback.drawDatatable();
        api.modal.error(response.error.message);
    } else if (response.data !== undefined) {
        app.release.panel.awaitingSignoff.callback.drawDataTable(response.data);
    }
    // Handle Exception
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
 * Draw Callback for Datatable
 */
app.release.panel.drawCallbackAwaitingSignOff = function () {
    $('[data-toggle="tooltip"]').tooltip();
    //Edit link click
    $("#release-panel-awaitingsignoff table").find("[name=" + C_APP_NAME_LINK_EDIT + "]").once("click", function (e) {
        e.preventDefault();
        //Remove tool tip after click at "[name=" + C_APP_NAME_LINK_EDIT + "]" link.
        $('.tooltip').remove();

        app.release.goTo.load($(this).attr("MtrCode"), $(this).attr("idn"));
    });
}


/**
 * Populate Data Table data
 * @param {*} data
 */
app.release.panel.awaitingSignoff.callback.drawDataTable = function (data) {
    if ($.fn.dataTable.isDataTable("#release-panel-awaitingsignoff table")) {
        app.library.datatable.reDraw("#release-panel-awaitingsignoff table", data);
    } else {

        var localOptions = {
            data: data,
            columns: [
                {
                    data: null,
                    render: function (data, type, row) {
                        var attributes = { idn: row.RlsCode, MtrCode: row.MtrCode };
                        return app.library.html.link.edit(attributes, row.MtrCode);
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return $("<span>", {
                            "data-toggle": "tooltip",
                            "text": row.GrpCode,
                            "title": row.GrpName
                        }).get(0).outerHTML;
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return app.label.static[row.RqsValue]
                    }
                }
            ],
            order: [0, 'asc'],
            drawCallback: function (settings) {
                app.release.panel.drawCallbackAwaitingSignOff();
            },
            //Translate labels language
            language: app.label.plugin.datatable
        };
        $("#release-panel-awaitingsignoff table").DataTable(jQuery.extend({}, app.config.plugin.datatable, localOptions)).on('responsive-display', function (e, datatable, row, showHide, update) {
            app.release.panel.drawCallbackAwaitingSignOff();
        });
    }
};
//#endregion