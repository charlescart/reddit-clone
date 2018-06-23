/*
* Ing.Charles Rodriguez
*/

function PostIndex() {
    var selft = this;
    this.constructor = function () {
        this.component_init();
    },
        this.component_init = function () {

            /*EVENTO BTN DELETE POST*/
            // iziToast.success({
            //     title: 'OK',
            //     message: 'Successfully inserted record!',
            //     position: 'topRight',
            //     theme: 'light',
            // });

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
                                    selft.lock();
                                    $(btn).buttonLoader('start');
                                },
                                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                                url: base_url + '/post',
                                type: 'DELETE',
                                data: {'id': id}
                            })
                                .done(function (data) {
                                    msg(data.msg);
                                    if (data.success) {
                                        location.reload();
                                    }
                                })
                                .fail(function (data) {
                                })
                                .always(function (data) {
                                    $(btn).buttonLoader('stop');
                                    selft.unlock();
                                });
                            // instance.hide({transitionOut: 'fadeOut'}, toast, 'button');
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

        }, /* Funciones Locales */
        this.lock = function () {
            $.blockUI({
                message: preloader,
                css: {'z-index': 100002, backgroundColor: 'transparent', color: '#fff', opacity: '1', border: 'none'}
            });
        },
        this.unlock = function(){
            $.unblockUI();
        }
}

$(function () {
    var post_index = new PostIndex();
    post_index.constructor();
});