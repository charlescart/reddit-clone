/*
* Ing.Charles Rodriguez
*/

function PostShow(commonFunctions) {
    var selft = this;
    commonFunctions.constructor();
    this.constructor = function () {
        this.component_init();
    },
        this.component_init = function () {

            /* EVENTO SUBMIT DE FORM POST EDIT */
            $('#form-comment').on('submit', function (event) {
                event.preventDefault();
                var form = $(this), form_id = this.id, form_action = this.action;
                $.ajax({
                    beforeSend: function () {
                        $('#' + form_id + ' [type="submit"]').buttonLoader('start');
                        commonFunctions.lock();
                    },
                    url: form_action,
                    type: 'POST',
                    data: form.serialize(),
                })
                    .done(function (data) {
                        if (data.success) {
                            msg(data.msg, time_toast, data.btn);
                            $('.content-comments').html(data.comments);
                            form[0].reset();
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
            /*FIN DE EVENTO SUBMIT DE FORM POST EDIT*/

            /*LIMPIAR LOS INPUTS DE ERROR'S ANTES DE SUBMIT DE FORM*/
            $('form').on('submit', function (event) {
                commonFunctions.clean_error_messages($(this).serializeArray(), this);
            });
            /*FIN DE LIMPIAR LOS INPUTS DE ERROR'S ANTES DE SUBMIT DE FORM*/

            $(document).on('click', '.open-reply', function(event){
                let id_comment = $(this).data('comment-hidden');
                $('.comment-hidden-'+id_comment).toggle();
                console.log(id_comment);
            });

        }
    /* Funciones Locales */
}

$(function () {
    var post_show = new PostShow(new commonFunctions());
    post_show.constructor();
});