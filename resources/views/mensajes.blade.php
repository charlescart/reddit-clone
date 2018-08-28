<script type="text/javascript">
    window.base_url = '{!! url('/') !!}';
    window.url_behind = '{!! URL::previous() !!}';
    window.mensaje_delete = '{!! trans('mensaje.delete') !!}';
    window.btn_delete = '{!! trans('btn.delete') !!}';
    window.btn_cancel = '{!! trans('btn.cancel') !!}';
    window.preloader = '<svg viewBox="0 0 120 120" width="100px" height="100px"> <circle class="inner" cx="60" cy="60" r="32"/> <circle class="middle" cx="60" cy="60" r="38"/> <circle class="outer" cx="60" cy="60" r="44"/></svg><span style="display: block; color: #aacbb0; margin-left: 10px;">{!! trans('mensaje.preloader') !!}</span>';
    window.msg_flash = '{!! (session('msg')) ? session('msg') : 'false' !!}';
    window.msg_unauthenticated = '{!! trans('auth.unauthenticated') !!}';

    /* toast */
    window.question_color = '#d39e00';
    window.error_color = '#c82333';
    window.success_color = '#28a745';
    window.warning_color = '#ffc107';
    window.time_toast = 6000;
    /* fin de toast */


    function msg(num, time = 6000, btn_number = 0) {
        let msg = [], btn = [];

        /* ERROR */
        msg[-1] = '{!! trans('mensaje.-1') !!}';
        msg[-2] = '{!! trans('mensaje.-2') !!}';
        msg[-3] = '{!! trans('mensaje.-3') !!}';
        msg[-4] = '{!! trans('mensaje.-4') !!}';

        /* SUCCESS */
        msg[1] = '{!! trans('mensaje.1') !!}';
        msg[2] = '{!! trans('mensaje.2') !!}';

        /* BOTONES */
        let btn_css = 'style="font-size: .9em; margin-top: -3px; padding: 0 5px;"';
        btn[0] = ' ';
        btn[1] = '<a href="{!! url('login') !!}" class="btn btn-outline-dark" '+btn_css+'>{!! trans('btn.auth') !!}</a>';
        btn[2] = '<a href="{!! URL::previous() !!}" class="btn btn-outline-dark btn-behind" '+btn_css+'>{!! trans('btn.behind') !!}</a>';

        if (num < 0)
            iziToast.error({message: (msg[num]+' '+btn[btn_number]), position: 'topRight', timeout: time, backgroundColor: error_color});
        else if (num > 0) /* del nro 1 en adelante */
            iziToast.success({message: (msg[num]+' '+btn[btn_number]), position: 'topRight', timeout: time, backgroundColor: success_color});
    }
</script>