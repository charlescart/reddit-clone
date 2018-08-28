/*
* Ing.Charles Rodriguez
*/

function PostIndex(commonFunctions) {
    var selft = this;
    commonFunctions.constructor();
    this.constructor = function () {
        this.component_init();
        commonFunctions.show_flash_message();
    },
        this.component_init = function () {

            /*EVENTO BTN DELETE POST*/
            $('.btn-delete-post').on('click', function (event) {
                let btn = this;
                let id = $(this).data('id');
                iziToast.question({
                    timeout: false,
                    close: false,
                    overlay: true,
                    toastOnce: true,
                    backgroundColor: question_color,
                    id: 'question',
                    message: mensaje_delete,
                    position: 'topRight',
                    buttons: [
                        ['<button><b>' + btn_delete + '</b></button>', function (instance, toast) {
                            $.ajax({
                                beforeSend: function () {
                                    instance.hide({transitionOut: 'fadeOut'}, toast, 'button');
                                    commonFunctions.lock();
                                    $(btn).buttonLoader('start');
                                },
                                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                                url: base_url + '/post/' + id,
                                type: 'DELETE',
                                data: {'id': id}
                            })
                                .done(function (data) {
                                })
                                .fail(function (data) {
                                    commonFunctions.show_error_messages(data);
                                })
                                .always(function (data) {
                                    $(btn).buttonLoader('stop');
                                    commonFunctions.unlock();
                                    if (data.success) {
                                        location.reload();
                                    } else
                                        msg(data.msg);
                                });
                        }, true],
                        ['<button>' + btn_cancel + '</button>', function (instance, toast) {

                            instance.hide({transitionOut: 'fadeOut'}, toast, 'button');
                        }],
                    ],
                    onClosing: function (instance, toast, closedBy) {
                        console.info('Closing | closedBy: ' + closedBy);
                    },
                    onClosed: function (instance, toast, closedBy) {
                        console.info('Closed | closedBy: ' + closedBy);
                    }
                });
            });
            /*FIN DE EVENTO BTN DELETE POST*/

        } /* Funciones Locales */
}

$(function () {
    var post_index = new PostIndex(new commonFunctions());
    post_index.constructor();
});