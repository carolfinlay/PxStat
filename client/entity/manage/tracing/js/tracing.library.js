/*******************************************************************************
Custom JS application specific
*******************************************************************************/
//#region Create Namespace
// Create Namespace
app.tracing = {};
app.tracing.validation = {};
app.tracing.ajax = {};
app.tracing.callback = {};

//#endregion

//#region input options
/**
 * Get authentication type from authentication.type.json file and populate dropdown
 */
app.tracing.ajax.readType = function () {
    api.ajax.jsonrpc.request(
        app.config.url.api.private,
        "PxStat.Security.Trace_API.ReadType",
        {},
        "app.tracing.callback.readType");
};

/**
 * Callback read Type dropdown
 * @param {*} response 
 */
app.tracing.callback.readType = function (response) {
    if (response.error) {
        // Handle the Error in the Response first
        api.modal.error(response.error.message);
    }
    else if (!response.data || (Array.isArray(response.data) && !response.data.length)) {
        api.modal.information(app.label.static["api-ajax-nodata"]);
        // Do nothing
    }
    else if (response.data) {
        // Handle the Data in the Response then
        var option = $("<option>", {
            "value": "",
            "text": app.label.static["any"],
            "selected": "selected"
        });
        $("#tracing-input").find("[name=select-authentication-type]").append(option);
        $.each(response.data, function (_index, element) {
            var option = $("<option>", {
                "value": element.AuthenticationType,
                "text": app.label.static[element.AuthenticationType.toLowerCase()]
                //{"AuthenticationType":"AUTHENTICATED"},{"AuthenticationType":"REGISTERED"},{"AuthenticationType":"ANONYMOUS"}
            });
            $("#tracing-input").find("[name=select-authentication-type]").append(option);
        });
        $("#tracing-input").find("[name=select-authentication-type]").prop('disabled', false);
    }
    // Handle Exception
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
* Set up date picker
*/
app.tracing.setDatePicker = function () {
    var start = moment().startOf('day');
    var end = moment();

    $("#tracing-input").find("[name=input-date-range]").daterangepicker({
        "opens": 'left',
        "startDate": start.format(app.config.mask.datetime.display),
        "endDate": end.format(app.config.mask.datetime.display),
        "autoUpdateInput": true,
        "timePicker": true,
        "timePicker24Hour": true,
        "locale": app.label.plugin.daterangepicker
    }, function (start, end) {

    });
    app.tracing.ajax.read();
};


//#endregion

//#region Read tracing
/**
 * Get data from api
 */
app.tracing.ajax.read = function () {
    var datePicker = $("#tracing-input").find("[name=input-date-range]").data('daterangepicker');
    var start = moment(datePicker.startDate).format(app.config.mask.datetime.ajax);
    var end = moment(datePicker.endDate).format(app.config.mask.datetime.ajax);
    api.ajax.jsonrpc.request(app.config.url.api.private,
        "PxStat.Security.Trace_API.Read",
        {
            "StartDate": start,
            "EndDate": end,
            "AuthenticationType": $("#tracing-input").find("[name=select-authentication-type]").val(),
            "TrcUsername": $("#tracing-input").find("[name=trc-username]").val().trim(),
            "TrcIp": $("#tracing-input").find("[name=trc-ip]").val().trim()
        },
        "app.tracing.callback.read",
        null,
        null,
        null,
        { async: false });
};

/**
 * Handle response from api
 * @param {*} response 
 */
app.tracing.callback.read = function (response) {

    if (response.error) {
        // Handle the Error in the Response first
        api.modal.error(response.error.message);
    } else if (response.data || response.data == null) {
        // Handle the Data in the Response then
        app.tracing.drawDataTable(response.data);
    }
    // Handle Exception
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
 * Draw datatable from result data
 * @param {*} data 
 */
app.tracing.drawDataTable = function (data) {
    //Initialize ClipboardJS
    new ClipboardJS('.cpy-btn');
    var datePicker = $("#tracing-input").find("[name=input-date-range]").data('daterangepicker');
    var exportFileName = 'tracing'
        + "_" + moment(datePicker.startDate).format(app.config.mask.datetime.file)
        + "_" + moment(datePicker.endDate).format(app.config.mask.datetime.file)
        + "_" + $("#tracing-input").find("[name=select-authentication-type]").val()
        + "." + moment().format(app.config.mask.datetime.file);
    if ($.fn.dataTable.isDataTable("#tracing-result table")) {
        app.library.datatable.reDraw("#tracing-result table", data);
    } else {

        var localOptions = {
            // Add Row Index to feed the ExtraInfo modal 
            createdRow: function (row, dataRow, dataIndex) {
                $(row).attr(C_APP_DATATABLE_ROW_INDEX, dataIndex);
            },
            buttons: [{
                extend: 'csv',
                title: exportFileName,
                exportOptions: {
                    format: {
                        body: function (data, row, column, node) {
                            // Strip HTML
                            return data.toString().replace(C_APP_REGEX_NOHTML, "");
                        }
                    }
                }
            }],
            data: data,
            columns: [
                {
                    data: null,
                    render: function (data, type, row) {
                        return moment(row.TrcDatetime).format(app.config.mask.datetime.display);
                    }
                },
                {
                    "data": null,
                    "defaultContent": '',
                    "render": function (data, type, row) {
                        return app.tracing.authenticationType(row.TrcCcnUsername, row.TrcPrvValue);
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return row.TrcPrvValue != null ? app.label.static[row.TrcPrvValue] : "";
                    }
                },

                { data: "TrcIp" },
                {
                    data: null,
                    defaultContent: '',
                    "render": function (data, type, row, meta) {
                        return $("<a>", {
                            href: "#",
                            name: C_APP_DATATABLE_EXTRA_INFO_LINK,
                            "idn": meta.row,
                            html:
                                $("<i>", {
                                    "class": "fas fa-info-circle text-info"
                                }).get(0).outerHTML + " " + row.TrcMethod
                        }).get(0).outerHTML;
                    }
                },
                {
                    data: "TrcParams",
                    "visible": false,
                    "searchable": true
                },
                {
                    data: "TrcUserAgent",
                    "visible": false,
                    "searchable": true
                }
            ],
            "order": [[0, "desc"]],
            drawCallback: function (settings) {
                app.tracing.drawCallback();
            },
            //Translate labels language
            language: app.label.plugin.datatable,
        };
        $("#tracing-result table").DataTable(jQuery.extend({}, app.config.plugin.datatable, localOptions)).on('responsive-display', function (e, datatable, row, showHide, update) {
            app.tracing.drawCallback();
        });

        // Invoke DataTables CSV export
        // https://stackoverflow.com/questions/45515559/how-to-call-datatable-csv-button-from-custom-button
        $("#tracing-result").find("[name=csv]").once("click", function () {
            $("#tracing-result table").DataTable().button('.buttons-csv').trigger();
        });

        // Bootstrap tooltip
        $("body").tooltip({
            selector: '[data-toggle="tooltip"]'
        });
    }
    $("#tracing-result").show();
};

/**
 * Draw Callback for Datatable
 */
app.tracing.drawCallback = function () {
    // Extra Info
    app.library.datatable.showExtraInfo('#tracing-result table', app.tracing.drawExtraInformation);
    // Click event viewLink
    $('#tracing-result table').find('.viewLink').once('click', function (e) {
        e.preventDefault();
        app.library.user.modal.read({ CcnUsername: $(this).attr("idn") });
    });
}

/**
 * Draw data in hidden columns
 * @param {*} data 
 */
app.tracing.drawExtraInformation = function (data) {
    var randomIdParams = app.library.utility.randomGenerator();
    var randomIdUserAgent = app.library.utility.randomGenerator();
    var details = $("#tracing-method-template").find("[name=method-detail]").clone();
    details.removeAttr('id');
    details.find("[name=params-card]").find("[name=params]").find("pre code").text(data.TrcParams).attr("id", "parameters-" + randomIdParams);
    details.find("[name=params-card]").find(".cpy-btn").attr("data-clipboard-target", "#parameters-" + randomIdParams);
    details.find("[name=user-agent-card]").find("pre code").text(data.TrcUserAgent).attr("id", "user-agent-" + randomIdUserAgent);
    details.find("[name=user-agent-card]").find(".cpy-btn").attr("data-clipboard-target", "#user-agent-" + randomIdUserAgent);
    return details.show().get(0).outerHTML;
};

/**
 * return text for user column
 * @param {*} user 
 * @param {*} privilege 
 */
app.tracing.authenticationType = function (user, privilege) {
    if (user == null && privilege == null) //Anonymous user
    {
        return $("<span>", {
            "data-toggle": "tooltip",
            "idn": user,
            "data-placement": "left",
            "title": "", //app.label.static["anonymous"],
            "data-original-title": app.label.static["anonymous"],
            "html": $("<i>", {
                "class": "fas fa-user-secret"
            }).get(0).outerHTML + " " + app.label.static["anonymous"]
        }).get(0).outerHTML;
    }
    else if (user != null && privilege != null) { //registered user
        return $("<a>", {
            "class": "viewLink",
            "idn": user,
            "href": "#",
            "data-toggle": "tooltip",
            "data-placement": "left",
            "title": "", //app.label.static["registered"],
            "data-original-title": app.label.static["registered"],
            "html":
                $("<i>", {
                    "class": "fas fa-user-check text-success"
                }).get(0).outerHTML +
                " " + user
        }).get(0).outerHTML;
    }
    else if (user != null && privilege == null) { //authenticated user, not registered
        return $("<a>", {
            "class": "viewLink",
            "idn": user,
            "data-toggle": "tooltip",
            "data-placement": "left",
            "title": "", //app.label.static["authenticated"],
            "data-original-title": app.label.static["authenticated"],
            "href": "#",
            "html":
                $("<i>", {
                    "class": "fas fa-user-times text-orange"
                }).get(0).outerHTML +
                " " + user
        }).get(0).outerHTML;
    }
};

//#endregion

//#region validation
app.tracing.validation.submit = function () {
    $("#tracing-input").find("form").onSanitiseForm().validate({
        onkeyup: function (element) {
            this.element(element);
        },
        rules: {
            "trc-ip":
            {
                validIp: true
            },
        },
        errorPlacement: function (error, element) {
            $("#tracing-input").find("[name=" + element[0].name + "-error-holder]").append(error[0]);
        },
        submitHandler: function () {
            app.tracing.ajax.read();
        }
    });
};
//#endregion





