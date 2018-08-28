/*
* Ing.Charles Rodriguez
*/

function PostEdit(commonFunctions) {
    var selft = this;
    commonFunctions.constructor();
    this.constructor = function () {
        this.component_init();
    },
        this.component_init = function () {

            /* EVENTO SUBMIT DE FORM POST EDIT */
            $('#form-post-edit').on('submit', function (event) {
                event.preventDefault();
                var form = $(this), form_id = this.id, form_action = this.action;
                $.ajax({
                    beforeSend: function () {
                        $('#' + form_id + ' [type="submit"]').buttonLoader('start');
                    },
                    url: form_action,
                    type: 'PUT',
                    data: form.serialize(),
                })
                    .done(function (data) {
                        if (data.success) {
                            msg(data.msg, time_toast, data.btn);
                        } else
                            msg(data.msg);
                    })
                    .fail(function (data) {
                        commonFunctions.apply_error_menssages(data, form_id);
                    })
                    .always(function (data) {
                        $('#' + form_id + ' [type="submit"]').buttonLoader('stop');
                    });
            });
            /*FIN DE EVENTO SUBMIT DE FORM POST EDIT*/

            /*LIMPIAR LOS INPUTS DE ERROR'S ANTES DE SUBMIT DE FORM*/
            $('form').on('submit', function (event) {
                commonFunctions.clean_error_messages($(this).serializeArray(), this);
            });
            /*FIN DE LIMPIAR LOS INPUTS DE ERROR'S ANTES DE SUBMIT DE FORM*/

            /*KEYUP DE INPUT TITULO DE FORM EDIT POST*/
            $('form [name="title"]').on('keyup', function (event) {
                $('form [name="slug"]').val(commonFunctions.string_to_slug(this.value, {}));
            });
            /* FIN DE KEYUP DE INPUT TITULO DE FORM EDIT POST */

        }
    /* Funciones Locales */
}

$(function () {
    var post_edit = new PostEdit(new commonFunctions());
    post_edit.constructor();
});