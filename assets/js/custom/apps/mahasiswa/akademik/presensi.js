"use strict";

// Class definition
var KTPresensi = function () {
    // Shared variables
    var table;
    var datatable;

    // Private functions
    var initDatatable = function () {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');

        tableRows.forEach(row => {
            const dateRow = row.querySelectorAll('td');
            const realDate = moment(dateRow[3].innerHTML, "DD/MM/YYYY").format(); // select date from 4th column in table
            dateRow[3].setAttribute('data-order', realDate);
        });

        // Init datatable --- more info on datatables: https://datatables.net/manual/
        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "info": false, // Menghilangkan info "Showing 1 to X of Y entries"
            'order': [],
            "searching": false, // Menghilangkan search box
            "lengthChange": false, // Menghilangkan dropdown "Show entries"
            "paging": false, // Menghilangkan pagination (previous/next)
            "pageLength": 10,
            "columnDefs": [{
                    orderable: false,
                    targets: 4
                }, // Disable ordering on column 4 (Alpha)
                {
                    orderable: false,
                    targets: 5
                }, // Disable ordering on column 5 (Ijin)
                {
                    orderable: false,
                    targets: 6
                } // Disable ordering on column 6 (Sakit)
            ],
            "dom": 't' // Hanya menampilkan table saja (tanpa fitur lainnya)
        });
    }

    // Hook export buttons
    var exportButtons = () => {
        const documentTitle = 'Presensi Mahasiswa';
        var buttons = new $.fn.dataTable.Buttons(table, {
            buttons: [{
                    extend: 'copyHtml5',
                    title: documentTitle
                },
                {
                    extend: 'excelHtml5',
                    title: documentTitle
                },
                {
                    extend: 'csvHtml5',
                    title: documentTitle
                },
                {
                    extend: 'pdfHtml5',
                    title: documentTitle
                }
            ]
        }).container().appendTo($('#kt_presensi_table_export'));

        // Hook dropdown menu click event to datatable export buttons
        const exportButtons = document.querySelectorAll('#kt_presensi_table_export_menu [data-kt-export]');
        exportButtons.forEach(exportButton => {
            exportButton.addEventListener('click', e => {
                e.preventDefault();

                // Get clicked export value
                const exportValue = e.target.getAttribute('data-kt-export');
                const target = document.querySelector('.dt-buttons .buttons-' + exportValue);

                // Trigger click event on hidden datatable export buttons
                target.click();
            });
        });
    }

    // Search Datatable --- official docs reference: https://datatables.net/reference/api/search()
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            datatable.search(this.value).draw();
        });
    }

    // Public methods
    return {
        init: function () {
            table = document.querySelector('#kt_presensi_table');

            if (!table) {
                return;
            }

            initDatatable();
            exportButtons();
            handleSearchDatatable();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTPresensi.init();
});