"use strict";

var KTRiwayatKelas = function () {
    // Private variables
    var datatable;
    var table;
    console.log("KTRiwayatKelas initialized");
    
    // Private functions
    var initKeenMenu = function() {
        if (typeof KTMenu !== 'undefined') {
            const menuElement = document.getElementById('kt_app_sidebar_menu');
            if (menuElement && !menuElement.KTMenu) {
                KTMenu.createInstance(menuElement, {
                    submenu: {
                        desktop: "accordion",
                        tablet: "accordion",
                        mobile: "accordion"
                    }
                });
                console.log('Menu diinisialisasi ulang');
                return true;
            }
        }
        return false;
    };

    // Public methods
    return {
        init: function () {
            table = document.querySelector("#kt_riwayat_kelas_table");
            console.log("Table initialized:", table);

            if (!table) {
                console.error("Tabel dengan ID #kt_riwayat_kelas_table tidak ditemukan");
                return;
            }

            // Inisialisasi menu pertama kali
            initKeenMenu();

            // Pastikan jQuery dan DataTables tersedia
            if (typeof $ === 'undefined' || !$.fn.DataTable) {
                console.error("jQuery atau DataTables tidak terdefinisi");
                return;
            }

            // Initialize datatable
            datatable = $(table).DataTable({
                info: false,
                searching: false,
                paging: false,
                order: [],
                columnDefs: [
                    { orderable: false, targets: 0 }  // Kolom No tidak bisa di-sort
                ],
                language: {
                    "zeroRecords": "Tidak ada data yang ditemukan"
                }
            });

            // Modifikasi event handler draw
            datatable.on("draw", function () {
                // Inisialisasi ulang menu setiap kali tabel di-redraw
                setTimeout(initKeenMenu, 100);
            });

            // Inisialisasi ulang menu
            initKeenMenu();
        }
    };
}();

// On document ready dengan fallback jika KTUtil tidak ada
if (typeof KTUtil !== 'undefined' && KTUtil.onDOMContentLoaded) {
    KTUtil.onDOMContentLoaded(function () {
        KTRiwayatKelas.init();
    });
} else {
    document.addEventListener("DOMContentLoaded", function() {
        KTRiwayatKelas.init();
    });
}