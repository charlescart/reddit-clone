/* 
 * Autor: Ing. Charles Rodriguez
 */

function Area_clientes() {
    var selft = this;
    this.constructor = function () {
        this.component_init();
    }
    this.component_init = function () {
        selft.reload_img('.form-audita');
        
        /*EVENTO DE PRE SELECCION DE TAB MODAL NEW USER*/
        $('.new-user').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var recipient = button.data('whatever');
            $('.nav-tabs a[href="#' + recipient + '"]').tab('show');
        });
        /*FIN EVENTO DE PRE SELECCION DE TAB MODAL NEW USER*/

        /*FORM LOGIN USER*/
        $('#form-login').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            selft.lock();
            selft.validar_tipo_user(form);

        });
        /*FIN FORM LOGIN USER*/

        /* FORM RESET PASSWORD */
        $('#form-send-token').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/password/email',
                type: 'POST',
                dataType: 'json',
                data: form.serialize()
            })
                    .done(function (data) {
                        if (data.success == true) {
                            form.trigger('reset');
                            $(".remember-password .close").click();
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        selft.clear_form_error('#form-send-token', form.serializeArray());
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-send-token' + ' .' + i).addClass('has-error');
                            $('#form-send-token' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function (data) {
                        selft.unlock();
                    });
        });
        /* FIN DE FORM RESET PASSWORD */

        /*FORM SEND TOKEN INPUT CLEAR*/
        $('.form-send-token input').on('keyup', function (e) {
            selft.clear_red_form($(this));
        });
        /* FIN FORM SEND TOKEN INPUT CLEAR */

        /*ANTES DE LEVANTAR EL MODAL OLVIDE MI PASSWORD*/
        $('.remember-password').on('show.bs.modal', function (e) {
            $('.form-send-token input[name="email"]').val($('.form-login input[name="email"]').val());
        })
        /*FIN DE ANTES DE LEVANTAR EL MODAL OLVIDE MI PASSWORD*/
    },
            /*LIMPIAR UN FORM*/
            this.clear_form_error = function (form, campos) {
                $.each(campos, function (i, field) {
                    $(form + ' .' + field.name).removeClass('has-error');
                });
                $(form + ' .error-form').text('');
            },
            this.lock = function () {
                $.blockUI({
                    message: '<div class="cssload-thecube"><div class="cssload-cube cssload-c1"></div><div class="cssload-cube cssload-c2"></div><div class="cssload-cube cssload-c4"></div><div class="cssload-cube cssload-c3"></div></div><div style="font-size: 13px; margin-top: 10px" class="">Espere un momento por favor...</div>',
                    css: {'z-index': 100002, backgroundColor: 'transparent', color: '#fff', opacity: '1', border: 'none'}
                });
            },
            this.unlock = function () {
                $.unblockUI();
            },
            this.clear_red_form = function (input) {
                var padre = $(input).parent('div.form-group');
                padre.removeClass('has-error');
                var hermano = $(input).siblings('span.error-form');
                hermano.text('');
            },
            /*RECARGAR CAPTCHA*/
            this.reload_img = function (form) {
                var captcha = $(form + ' img.captcha-img');
                var config = captcha.data('refresh-config');
                $.ajax({
                    method: 'GET',
                    url: APP_URL + '/get_captcha/' + config,
                }).done(function (response) {
                    captcha.prop('src', response);
                });
            },
            this.ajax_login = function (form) {
                $.ajax({
                    url: APP_URL + '/login',
                    type: 'POST',
                    data: form.serialize()
                })
                        .done(function (data) {
                            location.href = './home';
                        })
                        .fail(function (data) {
                            selft.clear_form_error('#form-login', form.serializeArray());
                            console.log(data.responseJSON);
                            if (data.responseJSON.error != 'undefined')
                                $('#form-login .error-login').text(data.responseJSON.error);
                            $.each(data.responseJSON, function (i, txt) {
                                $('#form-login .' + i).addClass('has-error');
                                $('#form-login .error-' + i).text(txt);
                                if (i == 'captcha') {
                                    if (txt == 'validation.captcha')
                                        $('#form-login .error-' + i).text('Codigo de imagen incorrecto.');
                                    else
                                        $('#form-login .error-' + i).text(txt);
                                }
                            });
                            selft.reload_img('.form-audita');
                        })
                        .always(function () {
                            selft.unlock();
                        });
            },
            this.validar_tipo_user = function (form) {
                $.ajax({
                    url: APP_URL + '/validar_tipo_user',
                    type: 'POST',
                    data: form.serialize()
                })
                        .done(function (data) {
//                        if (data.success == true)
                        })
                        .fail(function (data) {
                            selft.clear_form_error('#form-login', form.serializeArray());
                            console.log(data.responseJSON);
                            if (data.responseJSON.error != 'undefined')
                                $('#form-login .error-login').text(data.responseJSON.error);
                            $.each(data.responseJSON, function (i, txt) {
                                $('#form-login .' + i).addClass('has-error');
                                $('#form-login .error-' + i).text(txt);
                                if (i == 'captcha') {
                                    if (txt == 'validation.captcha')
                                        $('#form-login .error-' + i).text('Codigo de imagen incorrecto.');
                                    else
                                        $('#form-login .error-' + i).text(txt);
                                }
                            });
                            selft.reload_img('.form-audita');
                            selft.unlock();
                        })
                        .always(function (data) {
                            if (data.success == true) {
                                selft.ajax_login(form);
                            } else {
                                selft.reload_img('.form-audita');
                                msg(data.msg);
                                selft.unlock();
                            }
                        });
            },
            this.reload_img = function (form) {
                var captcha = $('img.captcha-img');
                var config = captcha.data('refresh-config');
                $.ajax({
                    method: 'GET',
                    url: APP_URL + '/get_captcha/' + config,
                }).done(function (response) {
                    captcha.prop('src', response);
                });
            }
}
$(function () {
    var area_clientes = new Area_clientes();
    area_clientes.constructor();
});