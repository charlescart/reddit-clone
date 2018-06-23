<script type="text/javascript">
    window.base_url='{!! url('/') !!}';
    window.url_bihind='{!! URL::previous() !!}';
    window.mensaje_delete='{!! trans('mensaje.delete') !!}';
    window.btn_delete='{!! trans('btn.delete') !!}';
    window.btn_cancel='{!! trans('btn.cancel') !!}';
    window.preloader='<svg viewBox="0 0 120 120" width="100px" height="100px"> <circle class="inner" cx="60" cy="60" r="32"/> <circle class="middle" cx="60" cy="60" r="38"/> <circle class="outer" cx="60" cy="60" r="44"/> <span style="display: block; color: #aacbb0;">{!! trans('mensaje.preloader') !!}</span></svg>';
    window.question_color='#ffc107e3';


    function msg(num, time = 6000) {
        let msg = [];

        /* ERROR */
        msg[-1] = '{!! trans('mensaje.-1') !!}';

        /* SUCCESS */
        msg[1] = '{!! trans('mensaje.1') !!}';

        if(num < 0)
            iziToast.error({message: msg[num], position: 'topRight', timeout: time, backgroundColor: '#f14858'});
        else /* del nro 1 en adelante */
            iziToast.success({message: msg[num], position: 'topRight', timeout: time, backgroundColor: '#32a54c'});
        // M.toast({html: msg[num]+btn[num_btn], displayLength: time});
    }
</script>