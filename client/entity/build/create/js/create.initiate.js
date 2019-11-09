/*******************************************************************************
Custom JS application specific
*******************************************************************************/
$(document).ready(function () {
    app.build.create.initiate.ajax.readLanguage();
    app.build.create.initiate.ajax.readFrequency();
    app.build.create.initiate.ajax.readCopyright();

    $("#build-create-initiate-setup").find("[name=button-matrix-lookup]").on("click", function (e) {
        app.build.create.initiate.ajax.matrixLookup();
    });

    if (app.config.entity.build.officialStatistics) {
        $("#build-create-initiate-setup [name=official-flag]").prop('checked', true);
    }
    else {
        $("#build-create-initiate-setup [name=official-flag]").prop('checked', false);
    }

    $("#build-create-initiate-setup [name=official-flag]").bootstrapToggle({
        on: app.label.static["true"],
        off: app.label.static["false"],
        onstyle: "primary",
        offstyle: "warning",
        width: C_APP_TOGGLE_LENGTH
    });

    //Confirm reset and reset details
    $("#build-create-initiate-setup").find("[name=button-clear]").once("click", function () {
        api.modal.confirm(
            app.label.static["create-reset-page"],
            app.build.create.initiate.clear
        );
    });

    //initiate validation for setup
    app.build.create.initiate.validation.setup();

    // Translate labels language (Last to run)
    app.library.html.parseStaticLabel();
});