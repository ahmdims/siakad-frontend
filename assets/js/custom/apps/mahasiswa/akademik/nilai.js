"use strict";

// Class definition
var KTNilaiMahasiswa = function() {
    // Shared variables
    var table;
    var datatable;

    // Private functions
    var initDatatable = function() {
        // Set date data order
        const tableRows = table.querySelectorAll('tbody tr');

        tableRows.forEach(row => {
            const dateRow = row.querySelectorAll('td');
            const realDate = moment(dateRow[3].innerHTML, "DD MMM YYYY, LT").format();
            dateRow[3].setAttribute('data-order', realDate);
        });

        // Init datatable
        datatable = $(table).DataTable({
            "info": false,
            'order': [],
            'pageLength': 10,
            "columnDefs": [
                { orderable: false, targets: 0 },
                { orderable: false, targets: 5 }
            ]
        });
    }

    var handleSearchDatatable = function() {
        const filterSearch = document.querySelector('[data-kt-nilai-table-filter="search"]');
        filterSearch.addEventListener('keyup', function(e) {
            datatable.search(e.target.value).draw();
        });
    }

    var initSelect2 = function() {
        // Inisialisasi Select2 dengan konfigurasi khusus Keen
        $('[data-control="select2"]').each(function() {
            var $this = $(this);
            $this.select2({
                minimumResultsForSearch: Infinity,
                dropdownParent: $this.data('dropdown-parent') ? $($this.data('dropdown-parent')) : null,
                placeholder: $this.data('placeholder') || 'Select an option',
                allowClear: Boolean($this.data('allow-clear'))
            });
        });
    };

    var handleExportButtons = function() {
        document.querySelector('#kt_nilai_export').addEventListener('click', function(e) {
            e.preventDefault();
            
            Swal.fire({
                text: "Export data akan menghasilkan file transkrip nilai dalam format PDF.",
                icon: "info",
                buttonsStyling: false,
                confirmButtonText: "Export Sekarang!",
                customClass: {
                    confirmButton: "btn btn-primary"
                }
            }).then(() => {
                setTimeout(() => {
                    Swal.fire({
                        text: "Export berhasil! File transkrip telah diunduh.",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "OK",
                        customClass: {
                            confirmButton: "btn btn-primary"
                        }
                    });
                }, 1000);
            });
        });
    }

    // Public methods
    return {
        init: function() {
            table = document.querySelector('#kt_nilai_table');

            if (!table) {
                return;
            }

            initDatatable();
            handleSearchDatatable();
            handleExportButtons();
            initSelect2();
        }
    };
}();

// On document ready
KTUtil.onDOMContentLoaded(function() {
    KTNilaiMahasiswa.init();
});