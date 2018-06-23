/* 
 * Autor: Ing. Charles Rodriguez
 */

function msg(num, time = 5000, num_btn = 0) {
    let msg = [];

    /* ERROR */
    let error = '<i class="fa fa-exclamation-triangle text-danger" aria-hidden="true"></i>&nbsp;&nbsp;';
    msg[-1] = error+'<span> No pudo realizarse la operación!</span>';

    /* SUCCESS */
    let success = '<i class="fa fa-check text-success" aria-hidden="true"></i>&nbsp;&nbsp;';
    msg[1] = success+'<span> Operación realizada con éxito!</span>';

    /* BOTONES */
    let btn = [];
    btn[0] = '';
    btn[1] = '&nbsp;&nbsp;<a style="cursor: pointer;" class="toast-recargar text-success">Recargar</a>';
    btn[1] = '&nbsp;&nbsp;<a style="cursor: pointer;" class="toast-back text-success"></a>';
    M.toast({html: msg[num]+btn[num_btn], displayLength: time});
}
