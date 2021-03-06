/*
* Ing.Charles Rodriguez
*/

function PostCreate(commonFunctions) {
    var selft = this;
    commonFunctions.constructor();
    this.constructor = function () {
        this.component_init();
        commonFunctions.show_flash_message();
    },
        this.component_init = function () {

            /*EVENTO SUBMIT DE FORM POST CREATE*/
            $('#form-post-create').on('submit', function (event) {
                event.preventDefault();
                var form = $(this), form_id = this.id;
                $.ajax({
                    beforeSend: function () {
                        $('#' + form_id + ' [type="submit"]').buttonLoader('start');
                        commonFunctions.lock();
                    },
                    url: base_url + '/post',
                    type: 'POST',
                    data: form.serialize()
                })
                    .done(function (data) {
                        if (data.success) {
                            form[0].reset();
                            // window.location.href = base_url + '/posts';
                            msg(data.msg, time_toast, data.btn);
                        } else
                            msg(data.msg);
                    })
                    .fail(function (data) {
                        commonFunctions.apply_error_menssages(data, form_id);
                    })
                    .always(function (data) {
                        $('#' + form_id + ' [type="submit"]').buttonLoader('stop');
                        commonFunctions.unlock();
                    });
            });
            /*FIN DE EVENTO SUBMIT DE FORM POST CREATE*/

            /*LIMPIAR LOS INPUTS ANTES DE SUBMIT DE FORM*/
            $('form').on('submit', function (event) {
                commonFunctions.clean_error_messages($(this).serializeArray(), this);
            });
            /*FIN DE LIMPIAR LOS INPUTS ANTES DE SUBMIT DE FORM*/

            /*KEYUP DE INPUT TITULO DE FORM CREATE POST*/
            $('form [name="title"]').on('keyup', function (event) {
                $('form [name="slug"]').val(commonFunctions.string_to_slug(this.value, {}));
            });
            /* FIN DE KEYUP DE INPUT TITULO DE FORM CREATE POST */

        }
    /* Funciones Locales */
}

$(function () {
    var post_create = new PostCreate(new commonFunctions());
    post_create.constructor();
});