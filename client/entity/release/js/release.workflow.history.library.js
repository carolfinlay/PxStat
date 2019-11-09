/*******************************************************************************
Custom JS application specific
*******************************************************************************/
//#region Add Namespace
app.release = app.release || {};

app.release.workflow.history = {};
app.release.workflow.history.render = {};
app.release.workflow.history.ajax = {};
app.release.workflow.history.callback = {};
//#endregion

app.release.workflow.history.read = function () {
    app.release.workflow.history.ajax.read();
};

//#region Ajax/Callback

/**
 * 
 */
app.release.workflow.history.ajax.read = function () {
    api.ajax.jsonrpc.request(
        app.config.url.api.private,
        "PxStat.Workflow.Workflow_API.ReadHistory",
        { RlsCode: app.release.RlsCode },
        "app.release.workflow.history.callback.read",
        null,
        null,
        null,
        { async: false });
};

/**
* 
 * @param {*} response
 */
app.release.workflow.history.callback.read = function (response) {
    if (response.error) {
        api.modal.error(response.error.message);
    } else if (response.data !== undefined) {
        app.release.workflow.history.callback.drawDataTable(response.data);
    }
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
 * Draw Callback for Datatable
 */
app.release.workflow.history.drawCallback = function () {
    $('[data-toggle="tooltip"]').tooltip();
    $("td.details-request-control i.fa.plus-control").css({ "color": "forestgreen" });
    app.library.datatable.showExtraInfo('#release-workflow-history table', app.release.workflow.history.render.extraInfo, app.release.workflow.history.render.extraInfoPost);
    // Bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip();
}


/**
* 
 * @param {*} data
 */
app.release.workflow.history.callback.drawDataTable = function (data) {
    $("#release-workflow-history").hide().fadeIn();
    if ($.fn.dataTable.isDataTable("#release-workflow-history table")) {
        app.library.datatable.reDraw("#release-workflow-history table", data);
    } else {
        var localOptions = {
            // Add Row Index to feed the ExtraInfo modal 
            createdRow: function (row, dataRow, dataIndex) {
                $(row).attr(C_APP_DATATABLE_ROW_INDEX, dataIndex);
            },
            data: data,
            columns: [
                {
                    data: null,
                    visible: true,
                    render: function (data, type, row) {
                        return app.label.static[row.RqsValue];
                    }
                },
                {
                    data: "WrqDtgCreateDatetime",
                    visible: true,
                    render: function (data, type, row) {
                        return row.WrqDtgCreateDatetime ? moment(row.WrqDtgCreateDatetime).format(app.config.mask.datetime.display) : "";
                    }
                },
                {
                    data: "WrqDtgCreateCcnUsername",
                    visible: false
                },
                {
                    data: null,
                    defaultContent: '',
                    sorting: false,
                    searchable: false,
                    "render": function (data, type, row, meta) {
                        return $("<a>", {
                            href: "#",
                            name: C_APP_DATATABLE_EXTRA_INFO_LINK,
                            "idn": meta.row,
                            html:
                                $("<i>", {
                                    "class": "fas fa-info-circle text-info"
                                }).get(0).outerHTML +
                                " " + app.label.static["details"]
                        }).get(0).outerHTML;
                    }
                },
                {
                    data: "WrqDatetime",
                    visible: false,
                    render: function (data, type, row) {
                        return row.WrqDatetime ? moment(row.WrqDatetime).format(app.config.mask.datetime.display) : "";
                    }
                },
                {
                    data: "WrqCmmValue",
                    visible: false,
                },
                {
                    data: null,
                    defaultContent: '',
                    type: "natural",
                    "render": function (data, type, row) {
                        return app.release.workflow.history.render.reply(row.RspCode, row.RspValue);
                    },
                },
                {
                    data: "WrsCmmValue",
                    visible: false
                },
                {
                    data: "WrsDtgCreateCcnUsername",
                    visible: false
                },
                {
                    data: "WrsDtgCreateDatetime",
                    visible: false,
                    render: function (data, type, row) {
                        return row.WrsDtgCreateDatetime ? moment(row.WrsDtgCreateDatetime).format(app.config.mask.datetime.display) : "";
                    }
                },
                {
                    data: null,
                    defaultContent: '',
                    type: "natural",
                    "render": function (data, type, row) {
                        return app.release.workflow.history.render.reply(row.SgnCode, row.SgnValue);
                    },
                },
                {
                    data: "WsgDtgCreateCcnUsername",
                    visible: false
                },
                {
                    data: "WsgDtgCreateDatetime",
                    visible: false,
                    render: function (data, type, row) {
                        return row.WsgDtgCreateDatetime ? row.WsgDtgCreateDatetime : "";
                    }
                },
                {
                    data: "WsgCmmValue",
                    visible: false
                }
            ],
            drawCallback: function (settings) {
                app.release.workflow.history.drawCallback();

            },
            //Translate labels language
            language: app.label.plugin.datatable,
            "order": [[1, "desc"]]
        };
        $("#release-workflow-history table").DataTable(jQuery.extend({}, app.config.plugin.datatable, localOptions)).on('responsive-display', function (e, datatable, row, showHide, update) {
            app.release.workflow.history.drawCallback();
        });
    }
};
//#endregion

//#region Render
/**
 * Generate an HTML workflow replay (Response or Publish)
 * @param {*} requestType
 * @param {*} textTooltip
 */
app.release.workflow.history.render.reply = function (requestType, textTooltip) {
    switch (requestType) {
        case C_APP_TS_RESPONSE_APPROVED:
        case C_APP_TS_SIGNOFF_APPROVED:
            return $("<a>", {
                "data-toggle": "tooltip",
                "data-original-title": textTooltip ? app.label.static[textTooltip.toLowerCase()] : "", //textTooltip,
                html:
                    $("<i>", {
                        class: "fas fa-check-circle text-success"
                    }).get(0).outerHTML
            }).get(0).outerHTML;
            break;

        case C_APP_TS_RESPONSE_REJECTED:
        case C_APP_TS_SIGNOFF_REJECTED:
            return $("<a>", {
                "data-toggle": "tooltip",
                "data-original-title": textTooltip ? app.label.static[textTooltip.toLowerCase()] : "", //textTooltip,
                html:
                    $("<i>", {
                        class: "fas fa-times-circle text-danger"
                    }).get(0).outerHTML
            }).get(0).outerHTML;
            break;

        default:
            return $("<a>", {
                "data-toggle": "tooltip",
                "data-original-title": app.label.static["pending"], //textTooltip,
                html:
                    $("<i>", {
                        class: "fas fa-question-circle text-info"
                    }).get(0).outerHTML
            }).get(0).outerHTML;
            break;
    }
};

/**
* 
 * @param {*} row
 */
app.release.workflow.history.render.extraInfo = function (row) {
    //clone template from html not reuse dynamically
    var grid = $("#release-workflow-history-extra-info").clone();
    //set the temporary ID for the postCallbackFunction
    grid.attr("id", "extraInfoPost");
    // Request
    grid.find("[name=rqs-value]").empty().html(app.label.static[row.RqsValue]); //Translation
    grid.find("[name=wrq-emergency-flag]").empty().html(app.library.html.boolean(row.WrqEmergencyFlag, true, true));
    grid.find("[name=wrq-datetime]").empty().html(row.WrqDatetime ? moment(row.WrqDatetime).format(app.config.mask.datetime.display) : "");
    grid.find("[name=wrq-reservation-flag]").empty().html(app.library.html.boolean(row.WrqReservationFlag, true, true));
    grid.find("[name=wrq-archive-flag]").empty().html(app.library.html.boolean(row.WrqArchiveFlag, true, true));
    grid.find("[name=wrq-cmm-value]").empty().html(app.library.html.parseBbCode(row.WrqCmmValue));
    grid.find("[name=wrq-dtg-create-datetime]").empty().html(row.WrqDtgCreateDatetime ? moment(row.WrqDtgCreateDatetime).format(app.config.mask.datetime.display) : "");
    grid.find("[name=wrq-dtg-create-ccn-username]").empty().html(app.library.html.link.user(row.WrqDtgCreateCcnUsername));

    // Response
    grid.find("[name=rsp-value]").empty().html(app.release.workflow.history.render.reply(row.RspCode, row.RspValue));
    grid.find("[name=wrs-cmm-value]").empty().html(app.library.html.parseBbCode(row.WrsCmmValue));
    grid.find("[name=wrs-dtg-create-datetime]").empty().html(row.WrsDtgCreateDatetime ? moment(row.WrsDtgCreateDatetime).format(app.config.mask.datetime.display) : "");
    grid.find("[name=wrs-dtg-create-ccn-username]").empty().html(app.library.html.link.user(row.WrsDtgCreateCcnUsername));

    // Signoff
    grid.find("[name=sgn-value]").empty().html(app.release.workflow.history.render.reply(row.SgnCode, row.SgnValue));
    grid.find("[name=sgn-cmm-value]").empty().html(app.library.html.parseBbCode(row.WsgCmmValue)); //No Translation - User comment
    grid.find("[name=sgn-dtg-create-datetime]").empty().html(row.WsgDtgCreateDatetime ? moment(row.WsgDtgCreateDatetime).format(app.config.mask.datetime.display) : "");
    grid.find("[name=sgn-dtg-create-ccn-username]").empty().html(app.library.html.link.user(row.WsgDtgCreateCcnUsername));

    // Remove non-relevant data
    switch (row.RqsCode) {
        case C_APP_TS_REQUEST_PUBLISH:
            // Do nothing
            break;
        case C_APP_TS_REQUEST_PROPERTY:
            grid.find("[name=wrq-emergency-flag]").parent().remove();
            grid.find("[name=wrq-datetime]").parent().remove();
            break;
        case C_APP_TS_REQUEST_DELETE:
        case C_APP_TS_REQUEST_ROLLBACK:
            grid.find("[name=wrq-emergency-flag]").parent().remove();
            grid.find("[name=wrq-datetime]").parent().remove();
            grid.find("[name=wrq-reservation-flag]").parent().remove();
            grid.find("[name=wrq-archive-flag]").parent().remove();
            break;
    }

    // Remove blank Response
    if (row.RspCode == null) {
        grid.find("[name=card-response]").remove();
    }

    // Remove blank Signoff
    if (row.SgnCode == null) {
        grid.find("[name=card-signoff]").remove();
    }

    return grid.show().get(0).outerHTML;
};

/**
* 
 * @param {*} row
 */
app.release.workflow.history.render.extraInfoPost = function (row) {
    // Request
    $("#extraInfoPost [name=wrq-dtg-create-ccn-username]").once('click', function (e) {
        e.preventDefault();
        app.library.user.modal.read({ CcnUsername: row.WrqDtgCreateCcnUsername });
    });

    // Response
    $("#extraInfoPost [name=wrs-dtg-create-ccn-username]").once('click', function (e) {
        e.preventDefault();
        app.library.user.modal.read({ CcnUsername: row.WrsDtgCreateCcnUsername });
    });

    // Signoff
    $("#extraInfoPost [name=sgn-dtg-create-ccn-username]").once('click', function (e) {
        e.preventDefault();
        app.library.user.modal.read({ CcnUsername: row.WsgDtgCreateCcnUsername });
    });

    //remove ID attribute used for the postCallbackFunction
    $("#extraInfoPost").removeAttr('id');
};
//#endregion