/* 
 * Autor: Ing. Charles Rodriguez
 */

function Buzon() {
    var selft = this, select_table_buzon, table_history, select_table_history, band = true, id_record = 0, filter = 1, payment = 2, msj_action = "¿Estás seguro de que desear eliminar el elemento de ID:";
    var datatables_spanish = {
        "sProcessing": 'Procesando...',
        "sLengthMenu": "Mostrar _MENU_ registros",
        "sZeroRecords": "No se encontraron resultados",
        "sEmptyTable": "Ningún dato disponible en esta tabla",
        "sInfo": "_START_ al _END_ de un total de _TOTAL_ registros",
        "sInfoEmpty": "0 al 0 de un total de 0 registros",
        "sInfoFiltered": "(filtrado de un total de _MAX_ registros)",
        "sInfoPostFix": "",
        "sSearch": "Buscar:",
        "sUrl": "",
        "sInfoThousands": ",",
        "sLoadingRecords": "Sin Documentos!",
        "oPaginate": {
            "sFirst": "Primero",
            "sLast": "Último",
            "sNext": "Siguiente",
            "sPrevious": "Anterior"
        },
        "oAria": {
            "sSortAscending": ": Activar para ordenar la columna de manera ascendente",
            "sSortDescending": ": Activar para ordenar la columna de manera descendente"
        },
        select: {rows: {_: "%d columnas seleccionadas", 0: "", 1: "1 columna seleccionada"}},
        "decimal": "",
        "emptyTable": "No data available in table",
        "info": "Showing _START_ to _END_ of _TOTAL_ entries",
        "infoEmpty": "Showing 0 to 0 of 0 entries",
        "infoFiltered": "(filtered from _MAX_ total entries)",
        "infoPostFix": "",
        "thousands": ",",
        "lengthMenu": "Show _MENU_ entries",
        "loadingRecords": "Loading...",
        "processing": 'Procesando...',
        "search": "Search:",
        "zeroRecords": "No matching records found",
        "paginate": {
            "first": "First",
            "last": "Last",
            "next": "Next",
            "previous": "Previous"
        },
        "aria": {
            "sortAscending": ": activate to sort column ascending",
            "sortDescending": ": activate to sort column descending"
        }
    };
    var table_documents;
    select_table_documents = {};
    var formatNumber = {
        separador: ",", // separador para los miles
        sepDecimal: '.', // separador para los decimales
        formatear: function (num) {
            num += '';
            var splitStr = num.split('.');
            var splitLeft = splitStr[0];
            var splitRight = splitStr.length > 1 ? ',' + splitStr[1] : '';
            var regx = /(\d+)(\d{3})/;
            while (regx.test(splitLeft)) {
                if (splitLeft == 1000000)
                    splitLeft = splitLeft.replace(regx, '1.000.000,00');
                else
                    splitLeft = splitLeft.replace(regx, '$1' + '.' + '$2' + ',00');
            }
            return this.simbol + splitLeft + splitRight;
        },
        new : function (num, simbol) {
            this.simbol = simbol || '';
            return this.formatear(num);
        }
    }
    this.constructor = function () {
        this.component_init();
    }
    this.component_init = function () {

        /*DATATABLES DE BUZON DE ARCHIVOS*/
        var table_buzon = $('#table_buzon').DataTable({
            "processing": true,
            "serverSide": true,
            'responsive': true,
            "sPaginationType": "full_numbers",
            'autoWidth': true,
            'select': true,
            'language': datatables_spanish,
            'bLengthChange': false,
            'lengthChange': false,
            'pageLength': 50,
            'sDom': '<"toolbar col-xs-12 col-md-6 row margin-top-14">frtip',
            'ajax': {headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}, 'url': APP_URL + '/get_document_inbox', 'type': 'POST', "data": function (d) {
                    d.filter = filter;
                    d.payment = payment;
                }},
            columnDefs: [{targets: [], visible: false}, {'bSortable': false, 'aTargets': '_all'}, {responsivePriority: 1, targets: [0, 3]}],
            'columns': [
                {'data': 'cod', 'className': 'select', 'defaultContent': '', 'width': '45px'},
                {'data': 'name', 'className': 'select', 'defaultContent': '', "width": "150px", },
                // {data: null, 'className': 'select, text-uppercase', 'width': '70px', render: function (data, type, row) {
                //     if(data.name != '')
                //         return data.name.split(' ', 1);
                //     else
                //         return '';
                //     }},
                {'data': 'bank_name', 'className': 'select', 'defaultContent': '', 'width': '145px'},
                {'data': 'importe_array', "width": "230px", 'className': 'text-left select', 'defaultContent': ''},
                {'data': 'titular_registral', 'className': 'select', 'defaultContent': ''},
                {'data': 'dni', 'className': 'select', 'defaultContent': ''},
//                {'data': 'registro', 'defaultContent': ''},
                {data: null, 'className': 'select', render: function (data, type, row) {
                        return data.registro.substr(0, 20);
                    }},
                {'data': 'finca', 'className': 'select', 'defaultContent': ''},
                {'data': 'pago', 'className': 'text-center select', "width": "60px", 'defaultContent': ''},
                {'data': 'action', "width": "55px", 'defaultContent': ''},
            ]
        });
        table_buzon
                .on('select', function (e, dt, type, indexes) {
                    var rowData = table_buzon.rows(indexes).data().toArray();
                    select_table_buzon = rowData[0];
                });

        $('#table_buzon tbody').on('click', 'tr td.select', function () {
            location.href = APP_URL + '/buzon-de-archivos/' + select_table_buzon.id;
        });

        $('input[type="search"]').on('keyup', function () {
            Cookies.set('search', this.value);
        });
        /*FIN DATATABLES DE BUZON DE ARCHIVOS*/

        /*AGREGANDO BTN AÑADIR NUEVO*/
        $('div.toolbar').html('<div class="col-xs-4 col-md-3" style="padding: 0; margin-right: 7px;"><div class="btn-group"><a data-toggle="modal" data-target="#modal-presupuesto" href="#" class="bs-tooltip btn btn-block btn-primary" style="height: 31px;width:126px;padding: 5px 0 0 0;padding-bottom: 2px;font-weight: bold; margin-top: 1px;">Nuevo Expediente</a></div> </div> <div class="col-xs-4" style="padding-left: 0;"><select id="filter-btn" class="form-control"><option value="1">En Proceso</option><option value="0">Papelera</option><option value="2">Finalizados</option><option value="3">Ver Todo</option></select></div> <div class="col-xs-4" style="padding-left: 0;"><select id="filter-btn-payment" class="form-control"><option value="2">Todas</option><option value="0">Transferencia Pendiente</option><option value="1">Pago Aceptado</option></select></div>');
        /*FIN DE AGREGANDO BTN AÑADIR NUEVO*/

        // ANTES DE LEVANDAR TODOS LOS MODALES UPLOAD
        $('.modal-upload').on('show.bs.modal', function (event) {
            var button = $(event.relatedTarget);
            var title_doc = button.data('whatever');
            var load = button.data('load');
            var hidden = button.data('hidden');
            var modal = $(this)
            modal.find('.title-modal').html('Envio de ' + title_doc)

            if (hidden)
                modal.find('.content-for-hidden').css('display', 'none');
            else
                modal.find('.content-for-hidden').css('display', 'block');

            if (load == 1) {
                selft.table_documents($('#id_provision').val(), [3, 15], '#table-pto');
                selft.event_dbclick_tables('#table-pto');
            }
            if (load == 2) {
                selft.table_documents($('#id_provision').val(), [1, 13], '#table-bsc');
                selft.event_dbclick_tables('#table-bsc');
            }
            if (load == 3) {
                selft.table_documents($('#id_provision').val(), [2, 14], '#table-ns')
                selft.event_dbclick_tables('#table-ns');
            }
            if (load == 4) {
                selft.table_documents($('#id_provision').val(), [4], '#table-be')
                selft.event_dbclick_tables('#table-be');
            }
            if (load == 5) {
                selft.table_documents($('#id_provision').val(), [5], '#table-df')
                selft.event_dbclick_tables('#table-df');
            }
            if (load == 6) {
                selft.table_documents($('#id_provision').val(), [6], '#table-p')
                selft.event_dbclick_tables('#table-p');
            }
            if (load == 7) {
                selft.table_documents($('#id_provision').val(), [7, 11], '#table-ic')
                selft.event_dbclick_tables('#table-ic');
            }
            if (load == 8) {
                selft.table_documents($('#id_provision').val(), [8], '#table-di')
                selft.event_dbclick_tables('#table-di');
            }
            if (load == 9) {
                selft.table_documents($('#id_provision').val(), [12], '#table-lf')
                selft.event_dbclick_tables('#table-lf');
            }
            if (load == 10) {
                selft.table_documents($('#id_provision').val(), [9], '#table-aviso')
                selft.event_dbclick_tables('#table-aviso');
            }
            if (load == 11) {
                selft.table_documents($('#id_provision').val(), [10], '#table-recogida')
                selft.event_dbclick_tables('#table-recogida');
            }
        });
        // ANTES DE LEVANDAR TODOS LOS MODALES UPLOAD

        /*AL OCULTARSE EL MODAL*/
        $('.modal-upload').on('hidden.bs.modal', function (event) {
            table_documents.clear();
            table_documents.destroy();
            var form = $(this).find('form:first');
            form[0].reset();
            $('#' + form.attr('id') + ' .t1').text('');
            $('#' + form.attr('id') + ' textarea').val('');
            $('#' + form.attr('id') + ' .document_id').val(null);
            $('#' + form.attr('id') + ' .document_id').removeAttr('name');
//            console.log(form);
        });
        /*AL OCULTARSE EL MODAL*/
        /*FORM-UPLOAD-PRESUPUESTO*/
        $('#form-pto').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
//            form.append('classification_id', parseInt(3));
            if ($('#clasificacion_pto').val() == 0)
                form.append('classification_id', parseInt(3));
            else if ($('#clasificacion_pto').val() > 0)
                form.append('classification_id', parseInt($('#clasificacion_pto').val()));
            selft.clear_form_error('#form-pto', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-pto')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
//                            $("#modal-1 .close").click();
                            $('#form-pto .document_id').val(null);
                            $('#form-pto .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-pto' + ' .' + i).addClass('has-error');
                            $('#form-pto' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-PRESUPUESTO*/

        /*FORM-UPLOAD-BUZON-SALDO-CERO*/
        $('#form-bsc').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
            if ($('#clasificacion_saldo_cero').val() == 0)
                form.append('classification_id', parseInt(1));
            else if ($('#clasificacion_saldo_cero').val() > 0)
                form.append('classification_id', parseInt($('#clasificacion_saldo_cero').val()));
            selft.clear_form_error('#form-saldo-cero', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-bsc')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                            $('#form-bsc .document_id').val(null);
                            $('#form-bsc .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-bsc' + ' .' + i).addClass('has-error');
                            $('#form-bsc' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-BUZON-SALDO-CERO*/

        /*FORM-UPLOAD-NOTA-SIMPLE*/
        $('#form-ns').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
            if ($('#clasificacion_nota_simple').val() == 0)
                form.append('classification_id', parseInt(2));
            else if ($('#clasificacion_nota_simple').val() > 0)
                form.append('classification_id', parseInt($('#clasificacion_nota_simple').val()));
//            form.append('document_id', parseInt($('#id_document').val()));
//            form.append('history_id', parseInt($('#history_id').val()));
            selft.clear_form_error('#form-ns', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-ns')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                            $('#form-ns .document_id').val(null);
                            $('#form-ns .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-ns' + ' .' + i).addClass('has-error');
                            $('#form-ns' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-NOTA-SIMPLE*/

        /*FORM-UPLOAD-BORRADOR-DE-ESCRITURA*/
        $('#form-be').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
            form.append('classification_id', parseInt(4));
            selft.clear_form_error('#form-be', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-be')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                            $('#form-be .document_id').val(null);
                            $('#form-be .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-be' + ' .' + i).addClass('has-error');
                            $('#form-be' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-BORRADOR-DE-ESCRITURA*/

        /*FORM-UPLOAD-DOCUMENTO-FIRMADO*/
        $('#form-df').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
            form.append('classification_id', parseInt(5));
            selft.clear_form_error('#form-df', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-df')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                            $('#form-df .document_id').val(null);
                            $('#form-df .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-df' + ' .' + i).addClass('has-error');
                            $('#form-df' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-DOCUMENTO-FIRMADO*/

        /*FORM-UPLOAD-PRESENTACION*/
        $('#form-p').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
            form.append('classification_id', parseInt(6));
            selft.clear_form_error('#form-p', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-p')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                            $('#form-p .document_id').val(null);
                            $('#form-p .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-p' + ' .' + i).addClass('has-error');
                            $('#form-p' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-PRESENTACION*/

        /*FORM-UPLOAD-INSCRIPCION/CALIFICADO*/
        $('#form-ic').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
            selft.clear_form_error('#form-ic', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-ic')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                            $('#form-ic .document_id').val(null);
                            $('#form-ic .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-ic' + ' .' + i).addClass('has-error');
                            $('#form-ic' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-INSCRIPCION/CALIFICADO*/

        /*FORM-UPLOAD-DOCUMENTO-INSCRITO*/
        $('#form-di').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
            form.append('classification_id', parseInt(8));
            selft.clear_form_error('#form-ic', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-di')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                            $('#form-di .document_id').val(null);
                            $('#form-di .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-di' + ' .' + i).addClass('has-error');
                            $('#form-di' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-DOCUMENTO-INSCRITO*/

        /*FORM-UPLOAD-LIQUIDACION-FINAL*/
        $('#form-lf').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
            form.append('classification_id', parseInt(12));
            selft.clear_form_error('#form-lf', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-lf')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                            $('#form-lf .document_id').val(null);
                            $('#form-lf .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-lf' + ' .' + i).addClass('has-error');
                            $('#form-lf' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-LIQUIDACION-FINAL*/

        /*FORM-UPLOAD-AVISO*/
        $('#form-aviso').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
            form.append('classification_id', parseInt(9));
            selft.clear_form_error('#form-aviso', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-aviso')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                            $('#form-aviso .document_id').val(null);
                            $('#form-aviso .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-aviso' + ' .' + i).addClass('has-error');
                            $('#form-aviso' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-AVISO*/

        /*FORM-UPLOAD-RECOGIDA*/
        $('#form-recogida').on('submit', function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            form.append('id_provision', parseInt($('#id_provision').val()));
            form.append('classification_id', parseInt(10));
            selft.clear_form_error('#form-recogida', camp.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/upload_doc_seguimiento',
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false

            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_documents.ajax.reload();
                            $('#form-recogida')[0].reset();
                            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                            $('.form-audita .t1').text('Adjuntar Archivo');
                            $('.content-progreso-cancel').html(data.data.html);
                            $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                            $('#form-aviso .document_id').val(null);
                            $('#form-aviso .document_id').removeAttr('name');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-recogida' + ' .' + i).addClass('has-error');
                            $('#form-recogida' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN FORM-UPLOAD-RECOGIDA*/

        /* VALIDA TAMAÑO MAXIMO DE FILE */
        $('.inputfile').change(function () {
            var sizeByte = this.files[0].size;
            var siezekiloByte = parseInt(sizeByte / 1024);

            if (siezekiloByte > 20000) {
                msg(-2);
                $('.form-audita .t1').text('Adjuntar Archivo');
                $(this).val('');
            }
            var padre = $(this).parent();
            padre.removeClass('has-error');
        });
        /* FIN VALIDA TAMAÑO MAXIMO DE FILE */

        /*FORM-SALDO-CERO INPUT CLEAR*/
        $('#form-bsc input, textarea').on('keyup', function (e) {
            selft.clear_red_form($(this));
        });
        /*FORM-SALDO-CERO INPUT CLEAR*/

        $('.btn-delete-all').on('click', function (e) {
            var button = $(this);
            button = button.data('classification');
            if (button == 7)
                button = $('#classification_id').val();
            var form = $(this).parents('form:first');
            var modal = $(this).parents('div.modal:first');
            swal({
                text: "Esta seguro que desea eliminar este documento?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar'
            }).then(function () {
                $.ajax({
                    beforeSend: function () {
                        selft.lock();
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: APP_URL + '/buzon-de-archivos/delete_file_seguimiento',
                    type: 'POST',
                    dataType: 'json',
                    data: {'classification_id': button, 'id_provision': $('#id_provision').val()}
                })
                        .done(function (data) {
                            if (data.success == true) {
                                form.trigger('reset');
                                $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
                                $('.form-audita .t1').text('Adjuntar Archivo');
                                $('.content-progreso-cancel').html(data.data.html);
                                $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                                modal.click();
                            }
                            msg(data.msg);
                        })
                        .fail(function () {
                        })
                        .always(function (data) {
                            selft.unlock();
                        });
            });
        });

        $('.ver-user-info').on('show.bs.modal', function (event) {
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/buzon-de-archivos/get_dates_for_user',
                type: 'POST',
                dataType: 'json',
                data: {'provision_id': $('#id_provision').val()}
            })
                    .done(function (data) {
                        if (data.success == true) {
                            $.each(data.data, function (i, value) {
                                $('#form-user-info input[name="' + i + '"]').val(value);
                            });
                        } else
                            $(".ver-user-info .close").click();
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            Materialize.toast('<div><i class="fa fa-exclamation-triangle text-red" aria-hidden="true"></i> ' + txt + '</div>', 7000, 'rounded')
                        });
                    })
                    .always(function (data) {
                        selft.unlock();
                    });
        });

        $('.ver-user-info').on('hidden.bs.modal', function (e) {
            $('#form-user-info')[0].reset();
        });
        /*####################################################################*/

        /*INPUT FILE PERZONALIZADO*/
        var inputs = document.querySelectorAll('.inputfile');
        Array.prototype.forEach.call(inputs, function (input) {
            var label = input.nextElementSibling, labelVal = label.innerHTML;
            input.addEventListener('change', function (e) {
                var fileName = '';
                if (this.files && this.files.length > 1)
                    fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
                else
                    fileName = e.target.value.split('\\').pop();
                if (fileName)
                    label.querySelector('span.t1').innerHTML = fileName;
                else
                    label.innerHTML = labelVal;
            });
        });

        var inputs = document.querySelectorAll('#file2');
        Array.prototype.forEach.call(inputs, function (input) {
            var label = input.nextElementSibling, labelVal = label.innerHTML;
            input.addEventListener('change', function (e) {
                var fileName = '';
                if (this.files && this.files.length > 1)
                    fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
                else
                    fileName = e.target.value.split('\\').pop();
                if (fileName)
                    label.querySelector('span').innerHTML = fileName;
                else
                    label.innerHTML = labelVal;
            });
        });
        /*FIN INPUT FILE PERZONALIZADO*/

        /*ANTES DE ABRIR EL MODAL DE RESPUESTA ADMIN*/
        $('.buzon-saldo-cero').on('show.bs.modal', function (e) {
            var modal = $(this);
            $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);
            if (select_table_buzon.mark_as_seen == 0) {
                $.ajax({
                    beforeSend: function () {
                        selft.lock();
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: APP_URL + '/mark_as_seen',
                    type: 'POST',
                    dataType: 'json',
                    data: {'id': select_table_buzon.id}
                })
                        .done(function (data) {
                            if (data.success = true) {
                                selft.apply_cancellation();
                                $('.cod_cancel').text('ID Cancelacíon: ' + select_table_buzon.cod);
                                if (band) {
                                    selft.datatable();
                                    band = false;
                                } else {
                                    table_history.destroy();
                                    selft.datatable();
                                }
                            } else
                                $(".buzon-saldo-cero .close").click();
                        })
                        .fail(function (data) {
                            $.each(data.responseJSON, function (i, txt) {
                                Materialize.toast('<div><i class="fa fa-exclamation-triangle text-red" aria-hidden="true"></i> ' + txt + '</div>', 5000, 'rounded');
                            });
                            $(".buzon-saldo-cero .close").click();
                        })
                        .always(function (data) {
                            table_buzon.ajax.reload();
                            selft.unlock();
                        });
            } else {
                selft.apply_cancellation();
                $('.cod_cancel').text('ID Cancelacíon: ' + select_table_buzon.cod);
                if (band) {
                    selft.datatable();
                    band = false;
                } else {
                    table_history.destroy();
                    selft.datatable();
                }
            }
        })
        /*ANTES DE ABRIR EL MODAL DE RESPUESTA ADMIN*/

        /*BOTON DELETE MODAL ADMIN*/
        $('#table_history').on('click', '.delete-doc', function (e) {
//            alert(select_table_history.id);
            swal({
                text: "Esta seguro que desea eliminar este documento?",
                type: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si'
            }).then(function () {
                $.ajax({
                    beforeSend: function () {
                        selft.lock();
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: APP_URL + '/bsc-admin/' + select_table_history.id,
                    type: 'DELETE',
                    dataType: 'json',
                    data: {}
                })
                        .done(function (data) {
                            if (data.success == true) {
                                table_history.ajax.reload();
                                table_buzon.ajax.reload();
                            }
                            msg(data.msg);
                        })
                        .fail(function () {
                        })
                        .always(function (data) {
                            selft.unlock();
                        });
            });
        });
        /*FIN BOTON DELETE MODAL ADMIN*/

        /*BOTON DE EDIT DOCUMENT HISTORY*/
        $('#table_history').on('click', '.edit-doc', function (e) {
            msg(3);
            $('#form-saldo-cero').addClass('hidden');
            $('#form-update-document').removeClass('hidden');

            $('.content-table-history').removeClass('margin-top-60');
            $('.content-table-history').addClass('margin-top-10');
            $('#form-update-document input[name="id"]').val(select_table_history.id);
            $('#form-update-document textarea[name="descripcion"]').val(select_table_history.description);
            $('#form-update-document input[name="fecha"]').val(select_table_history.fecha);
        });
        /*FIN DE BOTON DE EDIT DOCUMENT HISTORY*/

        /*CANCEL UPDATE FORM UPDATE DOCUMENT*/
        $('.cancel-update').on('click', function (e) {
            selft.apply_cancellation();
        });
        /*FIN DE CANCEL UPDATE FORM UPDATE DOCUMENT*/

        $(".datepicker").datepicker({
            /*defaultDate: +7,*/
            showOtherMonths: true,
            autoSize: true,
            appendText: '<span class="help-block">(dd-mm-yyyy)</span>',
            dateFormat: 'dd-mm-yy',
        });
        $(".fecha_doc_answers").datepicker("setDate", Fecha.hoy);

        /*SUBMIT DE FORM UPDATE DOCUMENT*/
        $('#form-update-document').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            selft.clear_form_error('#form-update-document', form.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/bsc-admin/' + select_table_history.id,
                type: 'PUT',
                data: form.serialize()

            })
                    .done(function (data) {
                        if (data.success = true) {
                            table_history.ajax.reload();
                            $('#form-update-document')[0].reset();
                            $('#form-update-document input[name="id"]').val('');
                            $('#form-update-document').addClass('hidden');
                            $('#form-saldo-cero').removeClass('hidden');

                            $('.content-table-history').removeClass('margin-top-10');
                            $('.content-table-history').addClass('margin-top-60');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-update-document' + ' .' + i).addClass('has-error');
                            $('#form-update-document' + ' .error-' + i).text(txt);
                            Materialize.toast('<div><i class="fa fa-exclamation-triangle text-red" aria-hidden="true"></i> ' + txt + '</div>', 5000, 'rounded');
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN DE SUBMIT DE FORM UPDATE DOCUMENT*/

        /*SELECT CLASIFICACION DE DOCUMENT*/
        $('#classification_document').on('change', function (e) {
            if ($(this).val() != 5)
                $('#form-saldo-cero textarea[name="description"]').val($('#classification_document option:selected').text());
            else if ($(this).val() == 5)
                $('#form-saldo-cero textarea[name="description"]').val('');
        });
        /*FIN DE SELECT CLASIFICACION DE DOCUMENT*/

        /*BTN CLICK PROPIEDADES*/
        $('#table_buzon').on('click', '.show-property', function (e) {
            swal({
                text: msj_action + select_table_buzon.id + "?",
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Aceptar',
                cancelButtonText: 'Cancelar'
            }).then(function () {
                $.ajax({
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: APP_URL + '/papelera_documents/' + select_table_buzon.id,
                    type: 'POST',
                    dataType: 'json',
                })
                        .done(function (data) {
                            if (data.success) {
                                table_buzon.ajax.reload();
                                msg(data.msg);
                            } else
                                msg(data.msg);
                        })
                        .fail(function (data) {
                        });
            });
        });

        $('#table_buzon').on('click', '.for-trash', function (e) {
            $('.id_pf_trash').html(select_table_buzon.cod);
        });
//        Materialize.toast('<div><i class="fa fa-check text-green" aria-hidden="true"></i> Operación realizada con éxito!</div>', 400000, 'rounded');
//        Materialize.toast('<div><i class="fa fa-exclamation-triangle text-red" aria-hidden="true"></i> Operación realizada con éxito!</div>', 400000, 'rounded');
        /*SUBMIT DE FORM PROVISION DE FONDOS TRASH*/
        $('#form-pf-trash').on('submit', function (e) {
            e.preventDefault();
            $('#form-pf-trash input[name="provision_id"]').val(select_table_buzon.id);
            var form = $(this);
            selft.clear_form_error('#form-pf-trash', form.serializeArray());
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/trash-pf',
                type: 'POST',
                data: form.serialize()

            })
                    .done(function (data) {
                        if (data.success = true) {
                            table_buzon.ajax.reload();
                            $('#form-pf-trash')[0].reset();
                            $('#trash-providing-funds .close').click();
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-pf-trash' + ' .' + i).addClass('has-error');
                            $('#form-pf-trash' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function () {
                        selft.unlock();
                    });
        });
        /*FIN DE SUBMIT DE FORM PROVISION DE FONDOS TRASH*/

        $('#btn-edit-prop').on('click', function (e) {
            selft.lock();
            $('#form-propiedad-ba').trigger('reset');
            $.ajax({
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/get_dates_property',
                type: 'POST',
                dataType: 'json',
                data: {'id': $('#id_document').val(), 'provision_id': $('#id_provision').val()}
            })
                    .done(function (data) {

                    })
                    .fail(function () {
                    })
                    .always(function (data) {
                        if (data.success == true) {
                            id_record = data.data.id_record;
                            $.each(data.data, function (i, v) {
                                if (v != '')
                                    $('#form-propiedad-ba input[name="' + i + '"], #form-propiedad-ba textarea[name="' + i + '"], #form-propiedad-ba select[name="' + i + '"]').val(v);
                            });
                            if (data.data.tramitado == 1)
                                $('#form-propiedad-ba input[name="tramitado"]').prop('checked', true);
                            if (data.data.subsanada == 1)
                                $('#form-propiedad-ba input[name="subsanada"]').prop('checked', true);

                            $('.info-prop').html('<b>Documento seleccionado ID: ' + data.cod + '</b>');

                            if (data.registros != null) {
                                $('#form-propiedad-ba #select_registro').html('');
                                $('#form-propiedad-ba #select_registro').append('<option value="0">Seleccione</option>');
                                $.each(data.registros, function (i, value) {
                                    $('#form-propiedad-ba #select_registro').append('<option value=' + value.id + '>' + value.name + '</option>');
                                });
                                $('#form-propiedad-ba #select_registro').val(data.data.id_record);
                                
                                $('.content-imports').html(data.imports);
                                
                                for (var i = 1; i <= data.data.importe_array.length; i++) {
                                    $('#form-propiedad-ba .importee-' + i + '-a').off();
                                }
                                
                                for (var i = 1; i <= data.data.importe_array.length; i++) {

                                    $('#form-propiedad-ba .importee-' + i + '-a').focus(function () {
                                        $(this).parseNumber({format: "#,###.00 €", locale: "es"});
                                    }).focusout(function () {
                                        this.value = this.value.replace(/\,/g, ".");
                                        console.log(this.value);
                                        $(this).formatNumber({format: "#,##0.00 €", locale: "es"});
                                    });

                                    $('#form-propiedad-ba .importee-' + i + '-a').on('keyup', function (e) {
                                        console.log('keyup: ' + this.value);
                                        var div_padre = $(this).parents('.form-group:first');
                                        var input = $(div_padre).find('input[name*="importe"]');
                                        input.val(this.value.replace(/\,/g, "."));
                                    });

                                }
                                $(".formatmoney-2").formatNumber({format: "#,##0.00 €", locale: "es"});
                            }
                        } else {
                            $(".propiedad-buzon-archivo .close").click();
                            msg(data.msg);
                        }
                        selft.unlock();
                    });
        });

        /*$('#propiedad-buzon-archivo').on('click', '.show-prop', function (e) {
         selft.lock();
         $('#form-propiedad-ba').trigger('reset');
         $.ajax({
         headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
         url: APP_URL + '/get_dates_property',
         type: 'POST',
         dataType: 'json',
         data: {'id': select_table_buzon.id}
         })
         .done(function (data) {
         
         })
         .fail(function () {
         })
         .always(function (data) {
         if (data.success == true) {
         console.log(data);
         id_record = data.data.id_record;
         $.each(data.data, function (i, v) {
         if (v != '')
         $('#form-propiedad-ba input[name="' + i + '"], #form-propiedad-ba textarea[name="' + i + '"], #form-propiedad-ba select[name="' + i + '"]').val(v);
         });
         if (data.data.tramitado == 1)
         $('#form-propiedad-ba input[name="tramitado"]').prop('checked', true);
         if (data.data.subsanada == 1)
         $('#form-propiedad-ba input[name="subsanada"]').prop('checked', true);
         $('.info-prop').html('<b>Documento seleccionado ID: ' + select_table_buzon.cod + '</b>');
         
         if (data.registros != null) {
         $('#form-propiedad-ba #select_registro').html('');
         $('#form-propiedad-ba #select_registro').append('<option value="0">Seleccione</option>');
         $.each(data.registros, function (i, value) {
         $('#form-propiedad-ba #select_registro').append('<option value=' + value.id + '>' + value.name + '</option>');
         });
         $('#form-propiedad-ba #select_registro').val('data.data.id_record');
         }
         } else {
         $(".propiedad-buzon-archivo .close").click();
         msg(data.msg);
         }
         selft.unlock();
         });
         });*/
        /*FIN EVENTO DE BTN CLICK PROPIEDADES*/

        /*SUBMIT DE FORM PROPIEDADES*/
        $('#form-propiedad-ba').on('submit', function (e) {
            e.preventDefault();
//            if ($('#form-propiedad-ba input[name="nif_titular"]').val() != '')
//                if (!selft.validateDNI($('#form-propiedad-ba input[name="nif_titular"]').val())) {
//                    $('.error-nif_titular').text('Introducir un DNI/NIE valido.');
//                    $('.nif_titular').addClass('has-error');
////                selft.scrollElement($('#form-propiedad-ba input[name="nif_titular"]'));
//                    return 0;
//                } else
//                    $('.error-nif_titular').text('');

            $('#form-propiedad-ba input[name="id"]').val($('#id_document').val());
            $('#form-propiedad-ba input[name="provision_id"]').val($('#id_provision').val());
            var form = $(this);
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/store_property_document',
                type: 'POST',
                dataType: 'json',
                data: form.serialize()
            })
                    .done(function (data) {
                        if (data.success == true) {
                            if (data.data != null) {
                                $('#datos .dni').html(data.data.dni);
                                $('#datos .finca').html(data.data.finca);
                                $('#datos .registro').html(data.data.registro);
                                $('#datos .name').html(data.data.nombre_titular);
                                $('#datos .dni').html(data.data.nif);
                                $('#datos .importes').html(data.data.importes);
                            }
                            $(".propiedad-buzon-archivo .close").click();
                            $('#form-propiedad-ba').trigger('reset');
                            selft.clear_form_error('#form-propiedad-ba', form.serializeArray());
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-propiedad-ba' + ' .' + i).addClass('has-error');
                            $('#form-propiedad-ba' + ' .error-' + i).text(txt);
                            if (i == 'id')
                                Materialize.toast('<div><i class="fa fa-exclamation-triangle text-red" aria-hidden="true"></i> ' + txt + '</div>', 5000, 'rounded');
                        });
                    })
                    .always(function (data) {
                        selft.unlock();
                    });
        });
        /*FIN DE EVENTO SUBMIT DE FORM PROPIEDADES*/

        /*KEYUP DE FORM PROPERTY PARA QUITAR LO ROJO DE LOS INPUTS*/
        $('#form-propiedad-ba input, #form-propiedad-ba textarea').on('keyup', function (e) {
            selft.clear_red_form($(this));
        });
        $('#select_notario, #select_provinces, #select_registro').on('change', function (e) {
            selft.clear_red_form($(this));
        });
        /*FIN DE KEYUP PARA QUITAR LO ROJO DE LOS INPUTS*/

        /*CHANGE SELECT PROVINCES*/
        $('#select_provinces').on('change', function (e) {
//            $('#form-propiedad-ba #select_registro').prop('disabled', 'disabled');
            $.ajax({
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/get_registro_for_provinces',
                type: 'POST',
                dataType: 'json',
                data: {'id': $(this).val()}
            })
                    .done(function (data) {

                    })
                    .fail(function () {
                    })
                    .always(function (data) {
                        if (data.success == true) {
//                            $('#form-propiedad-ba #select_registro').removeAttr('disabled');
                            $('#form-propiedad-ba #select_registro').html('');
                            $('#form-propiedad-ba #select_registro').append('<option class="text-justify" value="0">Seleccione</option>');
                            $.each(data.data, function (i, value) {
                                $('#form-propiedad-ba #select_registro').append('<option value=' + value.id + '>' + value.name + '</option>');
                            });
                            if (id_record != 0)
                                $('#form-propiedad-ba #select_registro').val(id_record);
                        } /*else
                         $('#select_registro').removeAttr('disabled');*/

                    });
        });
        /*FIN EVENTO CHANGE SELECT PROVINCES*/

        /*Lorena Salas*/
        $('.update-document').on('show.bs.modal', function (e) {
            //$('.t1').text('Adjuntar Archivo');
            $('.t1').text('Adjuntar Archivo');
            $('#form-update-doc .inputfile').val('');
            var modal = $(this);
            $('.cod_cancel').text('ID Cancelacíon: ' + select_table_buzon.cod);
        })

        $('#form-update-doc .inputfile').change(function () {
            var sizeByte = this.files[0].size;
            var siezekiloByte = parseInt(sizeByte / 1024);

            if (siezekiloByte > 20000) {
                msg(-2);
                $('.t1').text('Adjuntar Archivo');
                $(this).val('');
            }
            var padre = $(this).parent();
            padre.removeClass('has-error');
        });

        $('#form-update-doc').on('submit', /*'.show-upt-doc', */function (e) {
            e.preventDefault();
            var form = new FormData($(this)[0]), camp = $(this);
            //alert('primero');
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/update-document/' + select_table_buzon.id,
                type: 'POST',
                data: form,
                cache: false,
                contentType: false,
                processData: false
            })
                    .done(function (data) {
                        $('.update-document').hide();
                        $('.modal-backdrop').hide();
                        $('.blockUI').hide();
                        if (data.success)
                            table_buzon.ajax.reload();
                        msg(data.msg);
                    })
                    .fail(function () {
                        //alert('fallo');
                        msg(-1);
                    })
                    .always(function (data) {
                        //selft.unlock();
                    });
        });

        $('#filter-btn').change(function () {
            filter = $(this).val();
            if (filter == 1 || filter == 2) {
                msj_action = "¿Estás seguro de que desear eliminar el elemento de ID:";
                table_buzon.ajax.reload();
            }
            if (filter == 0) {
                msj_action = "¿Estás seguro de que desear mover a buzon el elemento de ID:";
                table_buzon.ajax.reload();
            }
            if (filter == 3) {
                msj_action = "¿Estás seguro de que desear eliminar el elemento de ID:";
                table_buzon.ajax.reload();
            }

        });

        $('#filter-btn-payment').on('change', function (e) {
            payment = $(this).val();
            table_buzon.ajax.reload();
        });

        /*Lorena Salas*/
        /*EVENTO CLICK EN VISUALIZAR PDF*/
        $('.view-pdf-presupuesto').on('click', function () {
            $('.text-discount').html('Introduzca un descuento para generar el PDF del presupuesto de ID: <b>' + $('#id_provision').val() + '</b>');
            $('#form-budget-discount input').parent().parent().removeClass('has-error');
            $('.error-form').html('');
//              $('.input-gestion').val(select_table_historico.gd_honorarios);
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/presupuesto-descuento/' + $('#id_provision').val(),
                type: 'POST',
                dataType: 'json'
                        //data: {}
            })
                    .done(function (data) {
                        selft.unlock();
                        if (data.success == true) {
                            $('.input-discount').val(data.data.descuento);
                            $('.input-gestion').val(data.data.gd_honorarios).formatNumber({format: "#,##0.00", locale: "es"});
                            //$('#d_imp_gestion').show();
                            //$('.btn-budget-discount').click();
                        }/*else{
                         
                         }*/
                    })
                    .fail(function () {
                    })
                    .always(function () {
                        //selft.unlock();
                    });
            //$('.input-discount').val('select_table_historico.descuento');
            //$('.input-gestion').val('select_table_historico.gd_honorarios')/*.formatNumber({format: "#,##0.00", locale: "es"})*/;
            $('#d_imp_gestion').show();
            $('.btn-budget-discount').click();
//              $('.input-discount').val('0');
        });
        /*FIN DE EVENTO CLICK EN VISUALIZAR PDF*/

        $('.input-gestion').focus(function () {
            $(this).parseNumber({format: "#,###.00", locale: "es"});
        }).blur(function () {
            $(this).formatNumber({format: "#,##0.00", locale: "es"});
        });

        /*FORM SUBMIT GUARDAR DESCUENTO*/
        $('#form-budget-discount').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/store_discount',
                type: 'POST',
                dataType: 'json',
                data: {'descuento': $('.input-discount').val(), 'id_provision': $('#id_provision').val(), 'imp_gestion': $('.input-gestion').val()}
            })
                    .done(function (data) {
                        if (data.success == true) {
                            $(".budget-discount-modal .close").click();
                            //table_historico.ajax.reload();
                            window.open('../../provision-pdf/' + $('#id_provision').val(), '_blank');
                        }
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            console.log(i + ' - ' + txt);
                            $('input[aria-describedby="' + i + '"]').parent().parent().addClass('has-error');
                            $('span.error-' + i).html(txt);
                            //$('.space').html('<br>');
                            Materialize.toast('<div><i class="fa fa-exclamation-triangle text-red" aria-hidden="true"></i> ' + txt + '</div>', 5000, 'rounded');
                        });
                    })
                    .always(function (data) {
                        selft.unlock();
                    });
        });
        /*FIN DE FORM SUBMIT GUARDAR DESCUENTO*/

        $('.conf-act').on('shown.bs.modal', function () {
            $('#conf-act-prov').val($('#id_provision').val());
        });

        /*$('.conf-act').on('hidden.bs.modal', function () {
         //alert('cerrar');
         $('#form-confirmar-activar').submit();
         });*/

        $('.btn-conf-act').on('click', function () {
            //alert('cerrar');
            $('#form-confirmar-activar').submit();
        });

        $('#form-confirmar-activar').on('submit', function (e) {
            e.preventDefault();
            var form = $(this);
            //console.log(form);
            //alert('ajax');
            $.ajax({
                beforeSend: function () {
                    selft.lock();
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/activar-provision/' + $('input#conf-act-prov').val(),
                type: 'POST',
                dataType: 'json',
                data: {/*'descuento': $('.input-discount').val(), 'id_provision': select_table_historico.id, 'imp_gestion': $('.input-gestion').val()*/}
            })
                    .done(function (data) {
                        $('.conf-act').hide();
                        $('.modal-backdrop').hide();
                        //table_historico.ajax.reload();
                        location.reload();
                        msg(data.msg);
                    })
                    .fail(function (data) {
                        //alert('error');
                    })
                    .always(function (data) {
                        selft.unlock();
                    });
        });

        $.datepicker.regional['es'] = {
            closeText: 'Cerrar',
            prevText: '< Anterior',
            nextText: 'Siguiente >',
            currentText: 'Hoy',
            monthNames: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            monthNamesShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
            dayNames: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
            dayNamesShort: ['Dom', 'Lun', 'Mar', 'Mié', 'Juv', 'Vie', 'Sáb'],
            dayNamesMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'],
            weekHeader: 'Sm',
            dateFormat: 'dd/mm/yy',
            firstDay: 1,
            isRTL: false,
            showMonthAfterYear: false,
            yearSuffix: ''
        };
        $.datepicker.setDefaults($.datepicker.regional['es']);

        /*AUTO LOAD DEL SEARCH DE LA TABLE*/
        if (typeof (Cookies.get('search')) != 'undefined' && Cookies.get('search') != '')
            table_buzon.search(Cookies.get('search')).draw();
        /*FIN AUTOLOAD DEL SEARCH DE LA TABLE*/

        /*FUNCIONALIDAD DE NUEVO PRESUPUESTO*/
        $('#g_hipoteca1').on('click', function (e) {
            $('#fincas').css('display', 'none');
//            tipo_cancel = '#g_hipoteca1';
            $('input[name="tipo_de_cancelacion"]').val('#g_hipoteca1');
            $(".number-fincas").val("1");
            $('.number_hipotecas').prop('disabled', true);
            $('#number_hipotecas_1').css('display', 'none');
            $('#number_hipotecas_2').css('display', 'none');
            $('.number_hipotecas').val('');
            selft.importes_create(1, this);
        });
        $('#g_hipoteca1').click();

        $('#g_hipoteca2').on('click', function (e) {
            $('#fincas').css('display', 'block');
//            tipo_cancel = '#g_hipoteca2';
            $('input[name="tipo_de_cancelacion"]').val('#g_hipoteca2');
            $(".number-fincas").val("0");
            $('.number_hipotecas').prop('disabled', true);
            $('#number_hipotecas_1').css('display', 'none');
            $('#number_hipotecas_2').css('display', 'none');
            $('.number_hipotecas').val('');
            selft.importes_create(1, this);
        });

        $('#g_hipoteca3').on('click', function (e) {
            $('#fincas').css('display', 'none');
//            tipo_cancel = '#g_hipoteca3';
            $('input[name="tipo_de_cancelacion"]').val('#g_hipoteca3');
            $(".number-fincas").val("1");
            $('#number_hipotecas_1').css('display', 'block');
            $('#number_hipotecas_2').css('display', 'none');
            $('#number_hipotecas_1').prop('disabled', false);
            $('#number_hipotecas_2').prop('disabled', true);
            $('#number_hipotecas_1').focus();
            $('#number_hipotecas_2').val('');
        });

        $('.number_hipotecas').on('keyup', function (event) {
            selft.importes_create(this.value, this);
        });

        $('#g_hipoteca4').on('click', function (e) {
            $('#fincas').css('display', 'block');
//            tipo_cancel = '#g_hipoteca4';
            $('input[name="tipo_de_cancelacion"]').val('#g_hipoteca4');
            $(".number-fincas").val("0");
            $('#number_hipotecas_1').css('display', 'none');
            $('#number_hipotecas_2').css('display', 'block');
            $('#number_hipotecas_2').prop('disabled', false);
            $('#number_hipotecas_1').prop('disabled', true);
            $('#number_hipotecas_2').focus();
            $('#number_hipotecas_1').val('');
        });
        /*FIN DE FUNCIONALIDAD DE NUEVO PRESUPUESTO*/

        /*RADIO BUTTON PARA HABILITAR O DESHABILITAR INPUT "ENTIDAD BANCARIA ORIGINAL"*/
        $('#radio_entidad_bancaria_diferente').on('click', function (e) {
            $('#entidad_bancaria_diferente').prop('disabled', false);
            $('#entidad_bancaria_diferente').focus();
        });

        $('#radio_entidad_bancaria_igual').on('click', function (e) {
            $('#entidad_bancaria_diferente').val('');
            $('#entidad_bancaria_diferente').prop('disabled', true);
        });
        /*RADIO BUTTON PARA HABILITAR O DESHABILITAR INPUT */

        /*BOTON CALCULAR*/
        $('.btn-calcular').on('click', function (e) {
            var button_calcular = this;
            $('#form-presupuesto .btn-etapa-1').addClass('hidden');
//            total_pf_neto = parseFloat(0), tipo_cancel, number_importe = 0, sec2 = parseFloat(0);
//            a = parseFloat(0), b = parseFloat(0), goal = parseFloat(0), c = parseFloat(0), gestion_documental = parseFloat(0);

            var form = $('#form-presupuesto');
            selft.clear_form_error2('#form-presupuesto', form.serializeArray());
            $.ajax({
                beforeSend: function () {
                    $(button_calcular).buttonLoader('start');
                    $('.content-provision').css('display', 'none');
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/calcular_presupuesto',
                type: 'POST',
                dataType: 'json',
                data: form.serialize()
            })
                    .done(function (data) {
                        if (data.success == true) {
                            $('.content-provision').html(data.provision_de_fondos);
                            $(".formatmoney").formatNumber({format: "#,##0.00 €", locale: "es"});
                            $('.btn-etapa-1').removeClass('hidden');
                            $('.content-provision').css('display', 'block');
                            step_1 = true;
                        } else
                            msg(data.msg);
                    })
                    .fail(function (data) {
                        $.each(data.responseJSON, function (i, txt) {
                            $('#form-presupuesto' + ' .' + i).addClass('has-error');
                            $('#form-presupuesto' + ' .error-' + i).text(txt);
                        });
                    })
                    .always(function (data) {
                        $(button_calcular).buttonLoader('stop');
                    });
        });
        /*FIN DE BOTON CALCULAR*/

        $('#form-presupuesto input, textarea').on('keyup', function (e) {
            selft.clear_red_form($(this));
        });
        $('#form-presupuesto select').on('change', function (e) {
            selft.clear_red_form($(this));
        });

        $('.btn-save-pf').on('click', function (e) {
            var btn = this;
            var modal = $(this).parents('div.modal:first');
            var btn_close = modal.filter('.close:first');
            $.ajax({
                beforeSend: function () {
                    $(btn).buttonLoader('start');
                },
                headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                url: APP_URL + '/guardar-presupuesto',
                type: 'POST',
                dataType: 'json',
                data: {}
            })
                    .done(function (data) {
                        if (data.success == true) {
                            table_buzon.ajax.reload();
                            $('#form-presupuesto').trigger('reset');
                            $('.content-provision').html('');
                            $('.content-provision').css('display', 'none');
                            $('.btn-etapa-1').css('display', 'none');
                            $('#modal-presupuesto .close').click();
                        }
                        msg(data.msg);
                    })
                    .fail(function () {
                    })
                    .always(function (data) {
                        $(btn).buttonLoader('stop');
                    });
        });


    },
            this.importes_create = function (number, obj) {
                var max = 15, min = 1, slider;

                if (number == '') /*CAMPO VACIO*/
                    return 0;

                if (isNaN(number)) { /*SI NO ES UN NUMERO*/
                    msg(-50);
                    $(obj).val(1);
                    return 0;
                } else if (number < min) { /*SI ES UN NUMERO Y SU VALOR ES MENOR A 1*/
                    msg(-51);
                    $(obj).val(min);
                    return 0;
                } else if (number > max) { /*SI ES UN NUMERO Y SU VALOR ES MAYOR A 10*/
                    msg(-52);
                    $(obj).val(max);
                    return 0;
                }

                var html = '';
//                var offset = '';
                for (var i = 1; i <= number; i++) {
//                    if (i > 1)
//                        offset = 'col-sm-offset-4';
                    html += "<div class='col-xs-12 col-sm-7 col-md-8 padding-0 col-sm-offset-3'>\n\
                                <label class='label-audita nunito-bold' for='importe'>¿Cu&aacute;l era el importe inicial del pr&eacute;stamo?</label>\n\
                            </div>\n\
                            <div class='col-xs-12 col-sm-5 col-md-7 col-lg-6 padding-0 col-sm-offset-3'>\n\
                                <div class='form-group text-center' style='margin-bottom: 0;'>\n\
                                    <input name='importe[]' type='hidden' class='form-control importe-" + i + "' value='0'>\n\
                                    <input type='text' class='form-control importe-" + i + "-a formatmoney-2 caja-min' value='0' style='text-align: center; margin-bottom: 10px; font-size: 1.1em !important; color: brown;' data-index='" + i + "'>\n\
                                </div>\n\
                            </div>\n\
                            <div class='col-xs-12 col-sm-8 col-sm-offset-3 col-md-8 col-md-offset-3 col-lg-8 col-lg-offset-3'>\n\
                                <span class='error-importe-" + i + " text-red error-form'></span>\n\
                            </div>";
                }

                $('#caso2').html(html);

                for (var i = 1; i <= number; i++) {

                    $('#form-presupuesto .importe-' + i + '-a').focus(function () {
                        $(this).parseNumber({format: "#,###.00 €", locale: "es"});
                    }).focusout(function () {
                        this.value = this.value.replace(/\,/g, ".");
                        $(this).formatNumber({format: "#,##0.00 €", locale: "es"});
                    });

                    $('#form-presupuesto .importe-' + i + '-a').on('keyup', function (e) {
                        console.log('keyup: ' + this.value);
                        var div_padre = $(this).parents('.form-group:first');
                        var input = $(div_padre).find('input[name*="importe"]');
                        input.val(this.value.replace(/\,/g, "."));
                        var code = e.which;
                        if (code == 13) {
                            console.log('enter');
                            var index = $(this).data('index');
                            if (index == number) { /*SI ES EL ULTIMO IMPORTE*/
                                if ($('#g_hipoteca2').is(':checked') || $('#g_hipoteca4').is(':checked'))
                                    $('select[name="numero_de_fincas"]').focus();
                            } else {
                                index += 1;
                                $('#form-presupuesto .importe-' + index + '-a').select();
                            }

                        }
                    });

                }
            },
            /*cargar los datos de los modales si ya existe un */
            this.load_dates_bsc = function (provision_id, classification_id, form, modal) {
                $.ajax({
                    beforeSend: function () {
                        selft.lock();
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: APP_URL + '/buzon-de-archivos/load_dates_modal',
                    type: 'POST',
                    dataType: 'json',
                    data: {'provision_id': provision_id, 'classification_id': classification_id}
                })
                        .done(function (data) {
                            if (data.success == true) {
                                $(".fecha_doc_answers").datepicker("setDate", data.data.created_at);
                                $(form + ' textarea[name="description"]').val(data.data.description);
                                $(form + ' .t1').text(data.data.file);
                                if (classification_id == 7)
                                    $('#classification_id').val(data.data.clasificacion_id);
                                if (data.data.clasificacion_id == 13)
                                    $('#clasificacion_saldo_cero').val(data.data.clasificacion_id);
                                if (data.data.clasificacion_id == 14)
                                    $('#clasificacion_nota_simple').val(data.data.clasificacion_id);
                                if (data.data.clasificacion_id == 1)
                                    $('#clasificacion_saldo_cero').val(data.data.clasificacion_id);
                                if (data.data.clasificacion_id == 2)
                                    $('#clasificacion_nota_simple').val(data.data.clasificacion_id);
                            }
                        })
                        .fail(function () {
                        })
                        .always(function (data) {
//                            console.log(provision_id, classification_id);
//                            selft.table_bsc(provision_id, classification_id);
                            selft.unlock();
                        });
            },
            /*cargar los datos de los modales si ya existe un */
            this.load_dates_pto = function (provision_id, classification_id, form, modal) {
                $.ajax({
                    beforeSend: function () {
                        selft.lock();
                    },
                    headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                    url: APP_URL + '/load_dates_pto_modal',
                    type: 'POST',
                    dataType: 'json',
                    data: {'provision_id': provision_id, 'classification_id': classification_id}
                })
                        .done(function (data) {
                            if (data.success == true) {
                                $(".fecha_doc_answers").datepicker("setDate", data.data.created_at);
                                $(form + ' textarea[name="description"]').val(data.data.description);
                                $(form + ' .t1').text(data.data.file);
                                console.log(classification_id);
                                if (classification_id == 7)
                                    $('#classification_id').val(data.data.clasificacion_id);
                            }
                        })
                        .fail(function () {
                        })
                        .always(function (data) {
                            selft.unlock();
                        });
            },
            /*LIMPIAR UN FORM*/
            this.clear_form_error = function (form, campos) {
                $.each(campos, function (i, field) {
                    if (field.name != 'importe[]')
                        $(form + ' .' + field.name).removeClass('has-error');
                });
                $(form + ' .error-form').text('');
                var padre = $(form + ' input[type="file"]').parent();
                padre.removeClass('has-error');
            },
            this.clear_form_error2 = function (form, campos) {
                $.each(campos, function (i, field) {
                    if (field.name != 'importe[]')
                        $(form + ' .' + field.name).removeClass('has-error');
                });
                $(form + ' .error-form').text('');
                var padre = $(form + ' input[type="file"]').parent();
                padre.removeClass('has-error');
            },
            this.clear_red_form = function (input) {
                var padre = $(input).parents('.form-group:first');
                padre.removeClass('has-error');
                padre.children('.error-form').text('');
            },
            this.show_msg = function (data) {
                $.each(data, function (i, txt) {
                    Materialize.toast('<div><i class="fa fa-exclamation-triangle text-red" aria-hidden="true"></i> ' + txt + '</div>', 7000, 'rounded')
                });
            },
            this.lock = function () {
                $.blockUI({
                    message: '<div class="cssload-thecube">\n\
                                <div class="cssload-cube cssload-c1"></div>\n\
                                <div class="cssload-cube cssload-c2"></div>\n\
                                <div class="cssload-cube cssload-c4"></div>\n\
                                <div class="cssload-cube cssload-c3"></div></div><div style="font-size: 13px; margin-top: 10px" class="">Espere un momento por favor...</div>',
                    css: {'z-index': 100002, backgroundColor: 'transparent', color: '#fff', opacity: '1', border: 'none'}
                });
            },
            this.unlock = function () {
                $.unblockUI();
            },
            this.validateDNI = function (value) {

                var validChars = 'TRWAGMYFPDXBNJZSQVHLCKET';
                var nifRexp = /^[0-9]{8}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
                var nieRexp = /^[XYZ]{1}[0-9]{7}[TRWAGMYFPDXBNJZSQVHLCKET]{1}$/i;
                var str = value.toString().toUpperCase();

                if (!nifRexp.test(str) && !nieRexp.test(str))
                    return false;

                var nie = str
                        .replace(/^[X]/, '0')
                        .replace(/^[Y]/, '1')
                        .replace(/^[Z]/, '2');

                var letter = str.substr(-1);
                var charIndex = parseInt(nie.substr(0, 8)) % 23;

                if (validChars.charAt(charIndex) === letter)
                    return true;

                return false;
            },
            this.apply_cancellation = function () {
                $('#form-update-document').trigger('reset');

                $('#form-update-document').addClass('hidden');
                $('#form-saldo-cero').removeClass('hidden');

                $('.content-table-history').removeClass('margin-top-10');
                $('.content-table-history').addClass('margin-top-60');
                $('#form-update-document input[name="id"]').val();
            },
            this.table_documents = function (pro, cla, table) {
                table_documents = $(table).DataTable({
                    "processing": true,
                    "bDestroy": true,
                    "serverSide": true,
                    'responsive': true,
                    "sPaginationType": "full_numbers",
                    'autoWidth': false,
                    'select': true,
                    'language': datatables_spanish,
                    'bLengthChange': false,
                    'lengthChange': false,
                    'pageLength': 3,
                    'order': [[0, "desc"]],
                    'sDom': '<"toolbar col-xs-12 col-md-6 row margin-top-14">rtip',
                    'ajax': {headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')}, 'url': APP_URL + '/buzon-de-archivos/documents-for-classification', 'type': 'POST', "data": function (d) {
                            d.provision_id = pro;
                            d.classification_id = cla;
                        }},
                    columnDefs: [{targets: [], visible: false}, {'bSortable': false, 'aTargets': [2, 3]}, {responsivePriority: 1, targets: [0, 3]}],
                    'columns': [
                        {data: null, 'className': '', render: function (data, type, row) {
                                if (data.file.length > 28)
                                    return data.file.substr(0, 28) + '.pdf';
                                else
                                    return data.file;
                            }},
//                        {'data': 'file', 'className': '', 'defaultContent': '', "width": "40%",},
                        {'data': 'fecha', 'className': '', 'defaultContent': '', "width": "15%", },
                        {data: null, 'className': '', render: function (data, type, row) {
                                if (data.comun.length > 19)
                                    return data.comun.substr(0, 19).trim() + '...';
                                else
                                    return data.comun;
                            }},
//                        {'data': 'description', 'className': '', 'defaultContent': '', "width": "40%",},
                        {'data': 'action', "width": "3%", 'className': 'text-right', 'defaultContent': ''},
                    ]
                });
                table_documents
                        .on('select', function (e, dt, type, indexes) {
                            var rowData = table_documents.rows(indexes).data().toArray();
                            select_table_documents = rowData[0];
                            var form = $(this).parents('form:first');
                            $('#' + form.attr('id') + ' .document_id').val(select_table_documents.id);
                            $('#' + form.attr('id') + ' .document_id').prop('name', 'document_id');
//                            form.append($('<input/>', {type: 'hidden', name: 'document_id', value: parseInt(select_table_documents.id)}));
                            selft.load_document(form.attr('id'), select_table_documents);
                        })
                        .on('deselect', function (e, dt, type, indexes) {
                            var form = $(this).parents('form:first');
                            $('#' + form.attr('id') + ' .document_id').val(null);
                            $('#' + form.attr('id') + ' .document_id').removeAttr('name');
//                            $('.form-audita input[name="document_id"]').remove();
                            form[0].reset();
                            $('#' + form.attr('id') + ' .t1').text('');
                            $('#' + form.attr('id') + ' textarea').val('');
                        });
            },
            this.load_document = function (form, row) {
                $('#' + form + ' .t1').text(row.file);
                $('#' + form + ' textarea[name="description"]').val(row.description);
                $(".fecha_doc_answers").datepicker("setDate", row.fecha);

                if (form == 'form-bsc')
                    $('#clasificacion_saldo_cero').val(row.clasificacion_id);

                if (form == 'form-ns')
                    $('#clasificacion_nota_simple').val(row.clasificacion_id);

                if (form == 'form-ic')
                    $('#classification_id').val(row.clasificacion_id);

                if (form == 'form-pto')
                    $('#clasificacion_pto').val(row.clasificacion_id);
            },
            this.download_document = function (url, name_doc) {
                    window.open(url, '_blank');
            },
            this.event_dbclick_tables = function (table) {
                /*DOBLE CLICK TABLE*/
                $(table).on('dblclick', 'tr', function () {
                    var data = table_documents.row(this).data();
                    selft.download_document(data.url_doc, data.file);
                });
                /*FIN DOBLE CLICK TABLE*/

                /*BUTTON ELIMINAR DOCUMENTO FOR ETAPA*/
                $(table).on('click', '.btn-delete-document', function (e) {
                    if (select_table_documents.file.length > 28)
                        select_table_documents.file = select_table_documents.file.substr(0, 28) + '.pdf';
                    var form = $(this).parents('form:first');
                    swal({
                        text: "Esta seguro que desea eliminar el documento <br><b>" + select_table_documents.file + "</b>?",
                        showCancelButton: true,
                        confirmButtonColor: '#d33',
                        cancelButtonColor: '#3085d6',
                        confirmButtonText: 'Eliminar',
                        cancelButtonText: 'Cancelar'
                    }).then(function () {

                        $.ajax({
                            beforeSend: function () {
                                selft.lock();
                            },
                            headers: {'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')},
                            url: APP_URL + '/buzon-de-archivos/delete-document-for-etapa',
                            type: 'DELETE',
                            dataType: 'json',
                            data: {'id': select_table_documents.id}
                        })
                                .done(function (data) {
                                    if (data.success == true) {
                                        form[0].reset();
                                        $('#' + form.attr('id') + ' .t1').text('');
                                        $('#' + form.attr('id') + ' textarea').val('');
                                        $('#' + form.attr('id') + ' .document_id').val(null);
                                        $('#' + form.attr('id') + ' .document_id').removeAttr('name');
                                        table_documents.ajax.reload();
                                        $('.content-progreso-cancel').html(data.data.html);
                                        $('.text-title-porcentaje').html(data.data.sum + '% COMPLETADO');
                                    }
                                    msg(data.msg);
                                })
                                .fail(function (data) {
                                    $.each(data.responseJSON, function (i, txt) {
                                        Materialize.toast('<div><i class="fa fa-exclamation-triangle text-red" aria-hidden="true"></i> ' + txt + '</div>', 5000, 'rounded');
                                    });
                                })
                                .always(function (data) {
                                    selft.unlock();
                                });
                    });
                });
                /*BUTTON ELIMINAR DOCUMENTO FOR ETAPA*/

                /*BOTTON DESCARGAR*/
                $(table).on('click', '.btn-download', function (e) {
                    selft.download_document(select_table_documents.url_doc, select_table_documents.file);
                });
                /*FIN BOTTON DESCARGAR*/
            }
}
$(function () {
    var buzon = new Buzon();
    buzon.constructor();
});
