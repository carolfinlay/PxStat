/*******************************************************************************
Custom JS application specific
*******************************************************************************/
//#region Add Namespace
app.build = app.build || {};
app.build.create.initiate = {};
app.build.create.initiate.ajax = {};
app.build.create.initiate.callback = {};
app.build.create.initiate.validation = {};
app.build.create.initiate.languages = [];
app.build.create.initiate.data = {
    "MtrCode": null,
    "MtrOfficialFlag": null,
    "FrqCode": null,
    "CprCode": null,
    "FrmType": null,
    "FrmVersion": null,
    "Dimension": []
};

//#region Matrix Lookup

/**
 * Ajax read call
 */
app.build.create.initiate.ajax.matrixLookup = function () {
    // Change app.config.language.iso.code to the selected one
    api.ajax.jsonrpc.request(app.config.url.api.private,
        "PxStat.Data.Matrix_API.ReadCodeList",
        {},
        "app.build.create.initiate.callback.matrixLookup");
};

/**
* * Callback subject read
* @param  {} response
*/
app.build.create.initiate.callback.matrixLookup = function (response) {
    if (response.error) {
        api.modal.error(response.error.message);
    } else if (response.data !== undefined) {
        // Handle the Data in the Response then
        app.build.create.initiate.callback.drawMatrix(response.data);
    }
    // Handle Exception
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
 * Draw Callback for Datatable
 */
app.build.create.initiate.drawCallbackDrawMatrix = function () {
    // Responsive
    $("#build-create-initiate-matrix-lookup table").DataTable().columns.adjust().responsive.recalc();
}


/**
* Draw table
* @param {*} data
*/
app.build.create.initiate.callback.drawMatrix = function (data) {
    var searchInput = $("#build-create-initiate-setup [name=mtr-value]").val();
    if ($.fn.dataTable.isDataTable("#build-create-initiate-matrix-lookup table")) {
        app.library.datatable.reDraw("#build-create-initiate-matrix-lookup table", data);
    } else {
        var localOptions = {
            data: data,
            columns: [
                {
                    data: null,
                    render: function (_data, _type, row) {
                        return row.MtrCode;
                    }
                },
            ],
            drawCallback: function (settings) {
                app.build.create.initiate.drawCallbackDrawMatrix();
            },
            //Translate labels language
            language: app.label.plugin.datatable
        };
        //Initialize DataTable
        $("#build-create-initiate-matrix-lookup table").DataTable(jQuery.extend({}, app.config.plugin.datatable, localOptions)).on('responsive-display', function (e, datatable, row, showHide, update) {
            app.build.create.initiate.drawCallbackDrawMatrix();
        });
        window.onresize = function () {
            // Responsive
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust().responsive.recalc();
        };
    }
    // Responsive
    $("#build-create-initiate-matrix-lookup table").DataTable().columns.adjust().responsive.recalc();
    $('#build-create-initiate-matrix-lookup').find("input[type=search]").val(searchInput);
    $("#build-create-initiate-matrix-lookup table").DataTable().search(searchInput).draw();
    $('#build-create-initiate-matrix-lookup').modal("show");
};

//#endregion

//#region set up languages radio buttons

/**
*  Get Languages from api to populate Language
*/
app.build.create.initiate.ajax.readLanguage = function () {
    api.ajax.jsonrpc.request(app.config.url.api.public,
        "PxStat.System.Settings.Language_API.Read",
        { LngIsoCode: null },
        "app.build.create.initiate.callback.readLanguage");
};

/**
 * Callback from server for read languages
 *
 * @param {*} response
 */
app.build.create.initiate.callback.readLanguage = function (response) {
    if (response.error) {
        api.modal.error(response.error.message);
    }
    else if (!response.data || (Array.isArray(response.data) && !response.data.length)) {
        api.modal.information(app.label.static["api-ajax-nodata"]);
        // Do nothing 
    }
    else if (response.data !== undefined) {
        // Create Language check boxes
        app.build.create.initiate.callback.drawLanguage(response);
    }
    // Handle Exception
    else api.modal.exception(app.label.static["api-ajax-exception"]);
};

/**
 * Draw screen for languages
 *
 * @param {*} response
 */
app.build.create.initiate.callback.drawLanguage = function (response) {
    // Clear pervious Check boxes items
    var languageItems = $("#build-create-initiate-setup").find("[name=lng-checkbox-group]");

    //add mandatory default language first
    languageItems.empty().append(function () {

        var defaultLng = $("<li>", {
            "class": "list-group-item",
            "html": $("<input>", {
                "type": "checkbox",
                "name": "lng-group",
                "value": app.config.language.iso.code,
                "lngName": app.config.language.iso.name,
                "checked": "checked",
                "disabled": "disabled"
            }).get(0).outerHTML + " " + app.config.language.iso.name
        }).get(0).outerHTML;
        return defaultLng;
    });
    // Check boxes containerCheck 
    $.each(response.data, function (key, value) {
        if (value.LngIsoCode != app.config.language.iso.code) {
            languageItems.append(function () {
                return $("<li>", {
                    "class": "list-group-item",
                    "html": $("<input>", {
                        "type": "checkbox",
                        "name": "lng-group",
                        "value": value.LngIsoCode,
                        "lngName": value.LngIsoName
                    }).get(0).outerHTML + " " + value.LngIsoName
                }).get(0).outerHTML;
            });
        }
    });
};


//Create and Hide dimension
app.build.create.initiate.clear = function () {
    api.content.load("#body", "entity/build/create/");
};

/**
*  Get Frequency Select data from API to populate role type drop down.
*/
app.build.create.initiate.ajax.readFrequency = function () {
    api.ajax.jsonrpc.request(app.config.url.api.private,
        "PxStat.System.Settings.Frequency_API.Read",
        null,
        "app.build.create.initiate.frequencySelect");
};

/**
 * Fill dropdown for frequency Select
 * @param {*} response 
 * @param {*} selectedPrvCode 
 */
app.build.create.initiate.frequencySelect = function (response) {
    data = response.data;
    //Set in properties
    $("#build-create-initiate-setup").find("[name=frequency-code]").append($("<option>", {
        "text": app.label.static["select-uppercase"],
        "disabled": "disabled",
        "selected": "selected"
    }));

    $.each(data, function (key, value) {
        $("#build-create-initiate-setup").find("[name=frequency-code]").append($("<option>", {
            "value": value.FrqCode,
            "text": value.FrqCode + " - " + app.label.static[value.FrqValue]
        }));
    });

    // Set in Modal
    $("#build-create-import").find("[name=frq-code]").append($("<option>", {
        "text": app.label.static["select-uppercase"],
        "disabled": "disabled",
        "selected": "selected"
    }));

    $.each(response.data, function (key, value) {
        $("#build-create-import").find("[name=frq-code]").append($("<option>", {
            "value": value.FrqCode,
            "text": value.FrqCode + " - " + app.label.static[value.FrqValue]
        }));
    });
};

/**
 * Read data table form server
 */
app.build.create.initiate.ajax.readCopyright = function () {
    api.ajax.jsonrpc.request(
        app.config.url.api.private,
        "PxStat.System.Settings.Copyright_API.Read",
        { CprCode: null },
        "app.build.create.initiate.callback.readCopyright",
        null,
        null,
        null,
        { async: false }
    );
};

/**
 * Callback from server - reading copyrights to display in dropdown
 *
 * @param {*} response
 */
app.build.create.initiate.callback.readCopyright = function (response) {
    data = response.data;
    // Map API data to select dropdown  model for main Subject search and update Subject search

    $("#build-create-initiate-setup").find("[name=copyright-code]").append($("<option>", {
        "text": app.label.static["select-uppercase"],
        "disabled": "disabled",
        "selected": "selected"
    }));

    $.each(data, function (key, value) {
        $("#build-create-initiate-setup").find("[name=copyright-code]").append($("<option>", {
            "value": value.CprCode,
            "text": value.CprValue,
        }));
    });
};

//#endregion

//#region build dimensions

//Create the Properties card
app.build.create.initiate.setUpDimensions = function () {
    $("#build-create-initiate-setup").find("[name=button-build], [name=mtr-value], [name=lng-group], [name=frequency-code], [name=copyright-code], [name=button-matrix-lookup], [name=official-flag], [name=import-show-modal]").prop("disabled", true);

    var languages = $("#build-create-initiate-setup").find("[name=lng-checkbox-group]").find("input[name=lng-group]:checked");
    app.build.create.initiate.languages = [];


    $(languages).each(function (key, item) {
        app.build.create.initiate.languages.push({
            "code": item.value,
            "value": item.attributes.lngname.value
        });

        app.build.create.initiate.data.Dimension.push(
            {
                "LngIsoCode": item.value,
                "MtrTitle": null,
                "FrqCode": null,
                "MtrNote": null,
                "Classification": [],
                "Statistic": [],
                "Frequency": {
                    "FrqValue": null,
                    "Period": []
                },
                "StatisticLabel": null
            });
    });

    app.build.create.dimension.drawTabs();
    $("#build-create-dimensions").show();
    //get properties from imported source
    $(languages).each(function (key, item) {

        if (app.build.create.file.import.content.JsonStat.length) {
            //We have imported souece

            //get source for this language if we have it
            var importedSource = null;
            $.each(app.build.create.file.import.content.JsonStat, function (index, data) {
                if (data.extension.language.code == item.value) {
                    importedSource = data;
                };
            });

            //we have imported data for this language
            if (importedSource) {
                //Set title
                $("#build-create-dimension-accordion-collapse-properties-" + item.value).find("[name=title-value]").val(importedSource.label);
                //Get statistic details
                for (i = 0; i < importedSource.length; i++) {
                    if (importedSource.Dimension(i).role == "metric") {
                        $("#build-create-dimension-accordion-collapse-properties-" + item.value).find("[name=statistic-label]").val(importedSource.Dimension(i).label);
                        $.each(importedSource.Dimension(i).id, function (index, value) {
                            var statistic = {
                                "SttCode": value,
                                "SttValue": importedSource.Dimension(i).Category(index).label,
                                "SttUnit": importedSource.Dimension(i).Category(index).unit.label,
                                "SttDecimal": importedSource.Dimension(i).Category(index).unit.decimals.toString()
                            };

                            //put this statistic in the correct dimension
                            $.each(app.build.create.initiate.data.Dimension, function (index, dimension) {
                                if (dimension.LngIsoCode == item.value) {
                                    this.Statistic.push(statistic);
                                }
                            });

                        });
                    }

                    else if (importedSource.Dimension(i).role == "time") {
                        $("#build-create-dimension-accordion-collapse-properties-" + item.value).find("[name=frequency-value]").val(importedSource.Dimension(i).label);

                        $.each(importedSource.Dimension(i).id, function (index, value) {
                            var variable = {
                                "PrdCode": value,
                                "PrdValue": importedSource.Dimension(i).Category(index).label
                            }

                            //put this statistic in the correct dimension
                            $.each(app.build.create.initiate.data.Dimension, function (index, dimension) {
                                if (dimension.LngIsoCode == item.value) {
                                    this.Frequency.Period.push(variable);
                                }
                            });
                        });


                    }
                    //classifications
                    else {
                        var classification = {
                            "ClsCode": importedSource.id[i],
                            "ClsValue": importedSource.Dimension(i).label,
                            "ClsGeoUrl": null,
                            "Variable": []
                        };

                        //get variables
                        $.each(importedSource.Dimension(i).id, function (index, value) {
                            classification.Variable.push(
                                {
                                    "VrbCode": value,
                                    "VrbValue": importedSource.Dimension(i).Category(index).label
                                }
                            );
                        });
                        //add geo url if it exists
                        if (importedSource.Dimension(i).link) {
                            classification.ClsGeoUrl = importedSource.Dimension(i).link.enclosure[0].href;
                        };

                        //put this statistic in the correct dimension
                        $.each(app.build.create.initiate.data.Dimension, function (index, dimension) {
                            if (dimension.LngIsoCode == item.value) {
                                this.Classification.push(classification);
                            }
                        });

                    }
                };
                var tinyMceId = $("#build-create-dimension-accordion-collapse-properties-" + item.value).find("[name=note-value]").attr("id");
                tinymce.get(tinyMceId).setContent(importedSource.note);
            }
        }
        app.build.create.dimension.drawStatistics(item.value);
        app.build.create.dimension.drawClassifications(item.value);
        app.build.create.dimension.drawPeriods(item.value);
    });



    $('html, body').animate({ scrollTop: $('#build-create-dimensions').offset().top }, 1000);
};


//#endregion

//#region validation
//validate properties
app.build.create.initiate.validation.setup = function () {
    $("#build-create-initiate-setup").find("form").trigger("reset").onSanitiseForm().validate({
        onkeyup: function (element) {
            this.element(element);
        },
        rules: {
            "mtr-value": {
                required: true,
                normalizer: function (value) {
                    value = value.sanitise(C_SANITISE_UPPERCASE, C_APP_REGEX_ALPHANUMERIC_DIACRITIC);
                    $(this).val(value);
                    return value;
                }
            },
            'frequency-code': {
                required: true,
            },
            "copyright-code": {
                required: true
            },
        },
        errorPlacement: function (error, element) {
            $("#build-create-initiate-setup [name=" + element[0].name + "-error-holder").empty().append(error[0]);
        },
        submitHandler: function () {
            app.build.create.initiate.data.MtrCode = $("#build-create-initiate-setup").find("[name=mtr-value]").val();
            app.build.create.initiate.data.FrqCode = $("#build-create-initiate-setup").find("[name=frequency-code]").val();
            app.build.create.initiate.data.CprCode = $("#build-create-initiate-setup").find("[name=copyright-code]").val();
            app.build.create.initiate.data.MtrOfficialFlag = $("#build-create-initiate-setup").find("[name=official-flag]").prop('checked');

            app.build.create.initiate.setUpDimensions();
        }
    }).resetForm();
};
//#endregion