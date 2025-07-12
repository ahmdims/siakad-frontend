"use strict";

// Class definition
var KTJadwal = function () {
    // Shared variables
    var table;
    var datatable;

    // Private functions
    var initDatatable = function () {
        // Init datatable --- more info on datatables: https://datatables.net/manual/
        datatable = $(table).DataTable({
            "info": false,
            'order': [],
            'pageLength': 10,
            "columnDefs": [
                { orderable: false, targets: 0 }, // Disable ordering on column 0 (no)
                { orderable: true, targets: 1 },   // Enable ordering on column 1 (hari)
                { orderable: true, targets: 2 },   // Enable ordering on column 2 (jam)
                { orderable: true, targets: 3 },   // Enable ordering on column 3 (kode mk)
                { orderable: true, targets: 4 },   // Enable ordering on column 4 (mata kuliah)
                { orderable: false, targets: 5 }   // Disable ordering on column 5 (dosen)
            ],
            "language": {
                "lengthMenu": "Tampilkan _MENU_ data per halaman",
                "zeroRecords": "Tidak ada data yang ditemukan",
                "info": "Menampilkan halaman _PAGE_ dari _PAGES_",
                "infoEmpty": "Tidak ada data tersedia",
                "infoFiltered": "(difilter dari _MAX_ total data)",
                "search": "Cari:",
                "paginate": {
                    "first": "Pertama",
                    "last": "Terakhir",
                    "next": "Selanjutnya",
                    "previous": "Sebelumnya"
                }
            }
        });
    }

    // Search Datatable
    var handleSearchDatatable = () => {
        const filterSearch = document.querySelector('[data-kt-filter="search"]');
        if (filterSearch) {
            filterSearch.addEventListener('keyup', function (e) {
                datatable.search(e.target.value).draw();
            });
        }
    }

    // Public methods
    return {
        init: function () {
            table = document.querySelector('#kt_jadwal_table');

            if (!table) {
                return;
            }

            initDatatable();
            handleSearchDatatable();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function () {
    KTJadwal.init();
});