/*******************************************************************************
Custom JS application specific
*******************************************************************************/
//#region Create Namespace
// Create Namespace
app.alert = {};
app.alert.ajax = {};
app.alert.modal = {};
app.alert.html = {};
app.alert.validation = {};
app.alert.callback = {};

//#endregion

//#region FUNCTIONS
/**
 * Initialise DatePicker
 * @param  {*} params
 */
app.alert.initialiseDatePicker = function (params) {
    $(params.Selector).daterangepicker({
        "opens": 'left',
        "singleDatePicker": true,
        "setDate": params.StartDate,
        "endDate": params.EndDate,
        "minDate": new Date(),
        "maxDate": params.MaxDate,
        "autoUpdateInput": true,
        "timePicker": true,
        "timePicker24Hour": true,
        "locale": app.label.plugin.daterangepicker
    });
    $(params.Selector).data('daterangepicker').setStartDate(params.StartDate);
    $(params.Selector).data('daterangepicker').setEndDate(params.StartDate);
};

//#endregion

//#region Read alert

/**
* Get data from API and Draw the Data Table for Alerts. Ajax call. 
*/
app.alert.ajax.read = function () {
    // Get data from API and Draw the Data Table for alert 
    api.ajax.jsonrpc.request(app.config.url.api.private,
        "PxStat.System.Navigation.Alert_API.Read",
        {
            RsnCode: null,
            LngIsoCode: app.label.language.iso.code
        },
        "app.alert.callback.read",
        null,
        null,
        null,
        { async: false });
};

/**
 * Callback function when the Alert Read call is successful.
 * @param {*} response
 */
app.alert.callback.read = function (response) {
    if (response.error) {
        // Handle the Error in the Response first
        app.alert.callback.drawDatatable();
        api.modal.error(response.error.message);
    } else if (response.data !== undefined) {
        // Handle the Data in the Response then
        app.alert.callback.drawDatatable(response.data);
    }
    // Handle Exception
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
 * Draw Callback for Datatable
 */
app.alert.drawCallback = function () {

    $('[data-toggle="tooltip"]').tooltip();

    //Event click update Alert.
    $("#alert-container table").find("[name=" + C_APP_NAME_LINK_EDIT + "]").once("click", function (e) {
        e.preventDefault();
        var idn = $(this).attr("idn");
        app.alert.ajax.readUpdate(idn);
    });
    // Display confirmation Modal on DELETE button click
    $("#alert-container table").find("[name=" + C_APP_NAME_LINK_DELETE + "]").once("click", app.alert.modal.delete);
}

/**
 * Create Alert DataTable and get JASON data
 * @param {*} data 
 */
app.alert.callback.drawDatatable = function (data) {
    if ($.fn.dataTable.isDataTable("#alert-container table")) {
        app.library.datatable.reDraw("#alert-container table", data);
    } else {

        var localOptions = {
            data: data,
            columns: [
                {
                    render: function (_data, _type, row) {
                        var attributes = { idn: row.LrtCode, LrtMessage: row.LrtMessage };
                        return app.library.html.link.edit(attributes, app.library.html.parseBbCode(row.LrtMessage));
                    }
                },
                {
                    data: null,
                    render: function (data, type, row) {
                        return app.library.utility.formatDatetime(row.LrtDatetime);
                    }
                },
                {
                    data: null,
                    sorting: false,
                    searchable: false,
                    render: function (data, type, row) {
                        return app.library.html.deleteButton({ idn: row.LrtCode }, false);
                    },
                    "width": "1%"
                }
            ],
            drawCallback: function (settings) {
                app.alert.drawCallback();
            },
            //Translate labels language
            language: app.label.plugin.datatable
        };
        $("#alert-container table").DataTable(jQuery.extend({}, app.config.plugin.datatable, localOptions)).on('responsive-display', function (e, datatable, row, showHide, update) {
            app.alert.drawCallback();
        });

        // alert must be first created in the default language
        if (app.label.language.iso.code == app.config.language.iso.code) {
            // Enable the button
            $("#alert-container").find("[name=button-create]").prop("disabled", false);
            // Hide warning
            $("#alert-container").find("[name=warning]").hide();
            // Create new subject button click event
            //Event click create Alert.
            $("#alert-container").find("[name=button-create]").once("click", app.alert.modal.create);
        } else {
            // Disable the button
            $("#alert-container").find("[name=button-create]").prop("disabled", true);
            // Show warning
            $("#alert-container").find("[name=warning]").show();
        }
    }
};

//#endregion

//#region Create alert

/**
 * Modal create function
 */
app.alert.modal.create = function () {
    //validation and reset Form
    app.alert.validation.create();
    //Display Modal
    $("#alert-modal-create").modal("show");
    //set focus on Create new modal
    $("#alert-modal-create").on("shown.bs.modal", function () {
        //set up default start and end dates for initial page load
        var startDate = new Date();
        startDate.setHours(0, 0, 0, 0);
        var endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        var maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 5);
        maxDate.setHours(23, 59, 59, 999);
        //set up start and end dates for daterangepicker
        var defaultParams = {
            "StartDate": moment(startDate).format(app.config.mask.datetime.display), //"18/12/2018 00:00:00"
            "EndDate": moment(startDate).format(app.config.mask.datetime.display),
            "MaxDate": moment(maxDate).format(app.config.mask.datetime.display),
            "Selector": "#alert-modal-create [name=lrt-datetime-create]"
        };
        app.alert.initialiseDatePicker(defaultParams);
        // Must be Id selector
        var tinyMceId = $("#alert-modal-create").find("[name=lrt-message-create]").attr("id");
        tinymce.get(tinyMceId).setContent("");
    });
};

/**
 * Create Alert Callback
 */
app.alert.ajax.create = function () {
    var tinyMceId = $("#alert-modal-create").find("[name=lrt-message-create]").attr("id");
    var lrtMessage = tinymce.get(tinyMceId).getContent();
    var lrtDateTime = $("#alert-modal-create").find("[name=lrt-datetime-create]").val(); // "07/12/2018 15:20:23"
    var lrtDateTimeAjax = moment(lrtDateTime, "DD/MM/YYYY HH:mm:ss").format(app.config.mask.datetime.ajax); // app.config.mask.datetime.ajax format 2018-12-31T00:00:00 - database
    var apiParams = {
        LrtMessage: lrtMessage,
        LrtDatetime: lrtDateTimeAjax, //lrtDateTimeAjax
    };
    // CAll Ajax to Create Reason. Do Redraw Data Table for Create Reason.
    api.ajax.jsonrpc.request(
        app.config.url.api.private,
        "PxStat.System.Navigation.Alert_API.Create",
        apiParams,
        "app.alert.callback.create"
    );
};

/**
* Create Alert to Table after Ajax success call
* @param {*} response 
*/
app.alert.callback.create = function (response) {
    //Redraw Data Table for Create Reason
    app.alert.ajax.read();
    api.content.load("#alert", "entity/manage/alert/index.notice.html");
    //Close modal
    $("#alert-modal-create").modal("hide");
    if (response.error) {
        api.modal.error(response.error.message);
    } else if (response.data == C_APP_API_SUCCESS) {
        api.modal.success(app.library.html.parseDynamicLabel("success-added", [""]));
    } else {
        api.modal.exception(app.label.static["api-ajax-exception"]);
    }
};

//#endregion

//#region Update alert
/**
 * @param {*} idn 
 */
app.alert.ajax.readUpdate = function (idn) {
    // Get data from API and Draw the Data Table for Alert. Populate date to the modal "alert-modal-update"
    api.ajax.jsonrpc.request(app.config.url.api.private,
        "PxStat.System.Navigation.Alert_API.Read",
        {
            LrtCode: idn,
            LngIsoCode: app.label.language.iso.code
        },
        "app.alert.callback.readUpdate");
};

/**
* Populate Alert data to Update Modal (alert-modal-update)
* @param {*} response 
*/
app.alert.callback.readUpdate = function (response) {
    app.alert.ajax.read();
    api.content.load("#alert", "entity/manage/alert/index.notice.html");
    if (response.error) {
        api.modal.error(response.error.message);
    }
    else if (!response.data || (Array.isArray(response.data) && !response.data.length)) {
        api.modal.information(app.label.static["api-ajax-nodata"]);
    }
    else if (response.data) {
        response.data = response.data[0];

        app.alert.modal.update(response.data);
    }
    // Handle Exception
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
* Populate Alert data to Update Modal (alert-modal-update)
* @param {*} response 
*/
app.alert.modal.update = function (response) {
    //Validation alert update and reset form
    app.alert.validation.update();
    //Update fields values
    $("#alert-modal-update").find("[name=lrt-code-update]").val(response.LrtCode);
    $("#alert-modal-update").find("[name=lrt-datetime-update]").val(response.LrtDatetime);
    //Show Update Modal
    $("#alert-modal-update").modal("show");
    //Set focus on Update new modal
    $("#alert-modal-update").on("shown.bs.modal", function () {
        var endDate = new Date();
        endDate.setHours(23, 59, 59, 999);
        var maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() + 5);
        maxDate.setHours(23, 59, 59, 999);
        //set up start and end dates for daterangepicker
        var defaultParams = {
            "StartDate": moment(response.LrtDatetime).format(app.config.mask.datetime.display), //"18/12/2018 00:00:00"
            "EndDate": moment(response.LrtDatetime).format(app.config.mask.datetime.display),
            "MaxDate": moment(maxDate).format(app.config.mask.datetime.display),
            "Selector": "#alert-modal-update [name=lrt-datetime-update]"
        };
        app.alert.initialiseDatePicker(defaultParams);
        // Must be Id selector
        var tinyMceId = $("#alert-modal-update").find("[name=lrt-message-update]").attr("id");
        tinymce.get(tinyMceId).setContent(response.LrtMessage);
    });
};

/**
* Ajax call Update Alert
* Save updated Alert via AJAX call.
*/
app.alert.ajax.update = function () {
    //Get fields values at alert-modal-update
    var lrtCodeUpdate = $("#alert-modal-update").find("[name='lrt-code-update']").val();
    var tinyMceId = $("#alert-modal-update").find("[name=lrt-message-update]").attr("id");
    var lrtMessageUpdate = tinymce.get(tinyMceId).getContent();
    var lrtDateTime = $("#alert-modal-update").find("[name=lrt-datetime-update]").val();
    var lrtDateTimeAjax = moment(lrtDateTime, "DD/MM/YYYY HH:mm:ss").format(app.config.mask.datetime.ajax); // app.config.mask.datetime.ajax  format 2018-12-31T00:00:00 - database
    var apiParams = {
        LrtCode: lrtCodeUpdate,
        LrtMessage: lrtMessageUpdate,
        LrtDatetime: lrtDateTimeAjax, // lrtDateTimeAjax
        LngIsoCode: app.label.language.iso.code
    };
    // CAll Ajax to Update the Alert. Get the fresh new data. Redraw table
    api.ajax.jsonrpc.request(
        app.config.url.api.private,
        "PxStat.System.Navigation.Alert_API.Update",
        apiParams,
        "app.alert.callback.update",
        null,
        null,
        null,
        { async: false }
    );
};

/**
 * Call back after update complete
 * @param  {*} response
 */
app.alert.callback.update = function (response) {
    app.alert.ajax.read();
    api.content.load("#alert", "entity/manage/alert/index.notice.html");
    $("#alert-modal-update").modal("hide");
    if (response.error) {
        api.modal.error(response.error.message);
    } else if (response.data == C_APP_API_SUCCESS) {
        api.modal.success(app.library.html.parseDynamicLabel("success-updated", [""]));
    } else {
        api.modal.exception(app.label.static["api-ajax-exception"]);
    }
};

//#endregion

//#region Delete alert
/**
 * Display Modal Delete alert
 */
app.alert.modal.delete = function () {
    var idn = $(this).attr("idn");
    api.modal.confirm(app.library.html.parseDynamicLabel("confirm-delete-record", [""]), app.alert.ajax.delete, idn);
};

/**
 * AJAX call to Delete a specific entry 
 * On AJAX success delete (Do reload table)
 * @param {*} idn
 */
app.alert.ajax.delete = function (idn) {
    // Call the API by passing the idn to delete alert from DB
    api.ajax.jsonrpc.request(
        app.config.url.api.private,
        "PxStat.System.Navigation.Alert_API.Delete",
        {
            LrtCode: idn
        },
        "app.alert.callback.delete",
        null,
        null,
        null,
        { async: false }
    );
};

/**
* Callback from server for Delete Alert
* @param {*} response
*/
app.alert.callback.delete = function (response) {
    //Redraw Data Table alert with fresh data.
    app.alert.ajax.read();
    api.content.load("#alert", "entity/manage/alert/index.notice.html");
    if (response.error) {
        api.modal.error(response.error.message);
    } else if (response.data == C_APP_API_SUCCESS) {
        // Display Success Modal
        api.modal.success(app.library.html.parseDynamicLabel("success-deleted", [""]));
    }
    // Handle Exception
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

//#endregion

//#region validation
/**
 * Validate Create Alert - Modal - Create Alert
 */
app.alert.validation.create = function () {
    $("#alert-modal-create form").trigger("reset").validate({
        ignore: [],
        rules: {
            "lrt-message-create":
            {
                required: function (element) {
                    tinymce.triggerSave();
                    return true;
                }
            },
            "lrt-datetime-create":
            {
                required: true
            },
        },
        errorPlacement: function (error, element) {
            $("#alert-modal-create [name=" + element[0].name + "-error-holder]").append(error[0]);
        },
        submitHandler: function () {
            app.alert.ajax.create();
        }
    }).resetForm();
};

/**
 * Validate Update Alert - Modal Update Alert
 */
app.alert.validation.update = function () {
    $("#alert-modal-update form").trigger("reset").validate({
        ignore: [],
        rules: {
            "lrt-code-update":
            {
                required: true
            },
            "lrt-message-update":
            {
                required: function (element) {
                    tinymce.triggerSave();
                    return true;
                }
            },
            "lrt-datetime-update":
            {
                required: true
            },
        },
        errorPlacement: function (error, element) {
            $("#alert-modal-update [name=" + element[0].name + "-error-holder]").append(error[0]);
        },
        submitHandler: function () {
            app.alert.ajax.update();
        }
    }).resetForm();
};

//#endregion
