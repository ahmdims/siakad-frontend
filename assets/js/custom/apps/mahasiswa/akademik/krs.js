"use strict";

var KTKrsList = function () {
    // Private variables
    var datatable;
    var table;
    console.log("KTKrsList initialized");
    
    // Private functions
    var initDeleteRow = () => {
        table.querySelectorAll('[data-kt-krs-table-filter="delete_row"]').forEach(button => {
            button.addEventListener("click", function (e) {
                e.preventDefault();
                const row = e.target.closest("tr");
                const mataKuliah = row.querySelectorAll("td")[3].innerText; // Kolom ke-4 (index 3) untuk mata kuliah
                
                Swal.fire({
                    text: "Apakah Anda yakin ingin menghapus mata kuliah " + mataKuliah + "?",
                    icon: "warning",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Ya, hapus!",
                    cancelButtonText: "Tidak, batalkan",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        Swal.fire({
                            text: "Anda telah menghapus " + mataKuliah + "!.",
                            icon: "success",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, mengerti!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary"
                            }
                        }).then(function () {
                            datatable.row($(row)).remove().draw();
                        });
                    } else if (result.dismiss === 'cancel') {
                        Swal.fire({
                            text: mataKuliah + " tidak jadi dihapus.",
                            icon: "error",
                            buttonsStyling: false,
                            confirmButtonText: "Ok, mengerti!",
                            customClass: {
                                confirmButton: "btn fw-bold btn-primary"
                            }
                        });
                    }
                });
            });
        });
    };

    var initDeleteSelected = () => {
        const deleteSelected = document.querySelector('[data-kt-krs-table-select="delete_selected"]');
        
        deleteSelected.addEventListener("click", function () {
            const checkboxes = table.querySelectorAll('tbody [type="checkbox"]:checked');
            
            Swal.fire({
                text: "Apakah Anda yakin ingin menghapus semua mata kuliah yang dipilih?",
                icon: "warning",
                showCancelButton: true,
                buttonsStyling: false,
                confirmButtonText: "Ya, hapus!",
                cancelButtonText: "Tidak, batalkan",
                customClass: {
                    confirmButton: "btn fw-bold btn-danger",
                    cancelButton: "btn fw-bold btn-active-light-primary"
                }
            }).then(function (result) {
                if (result.value) {
                    Swal.fire({
                        text: "Anda telah menghapus semua mata kuliah yang dipilih!.",
                        icon: "success",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, mengerti!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary"
                        }
                    }).then(function () {
                        checkboxes.forEach(checkbox => {
                            const row = checkbox.closest("tr");
                            datatable.row($(row)).remove().draw();
                        });
                        
                        // Uncheck header checkbox
                        table.querySelector('[type="checkbox"][data-kt-check="true"]').checked = false;
                        toggleToolbar();
                    });
                } else if (result.dismiss === 'cancel') {
                    Swal.fire({
                        text: "Mata kuliah yang dipilih tidak jadi dihapus.",
                        icon: "error",
                        buttonsStyling: false,
                        confirmButtonText: "Ok, mengerti!",
                        customClass: {
                            confirmButton: "btn fw-bold btn-primary"
                        }
                    });
                }
            });
        });
    };

    var toggleToolbar = () => {
        const toolbarBase = document.querySelector('[data-kt-krs-table-toolbar="base"]');
        const toolbarSelected = document.querySelector('[data-kt-krs-table-toolbar="selected"]');
        const selectedCount = document.querySelector('[data-kt-krs-table-select="selected_count"]');
        const checkboxes = table.querySelectorAll('tbody [type="checkbox"]:checked');
        
        if (checkboxes.length > 0) {
            selectedCount.innerHTML = checkboxes.length;
            toolbarBase.classList.add("d-none");
            toolbarSelected.classList.remove("d-none");
        } else {
            toolbarBase.classList.remove("d-none");
            toolbarSelected.classList.add("d-none");
        }
    };

    var initCheckboxes = () => {
        table.querySelectorAll('[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener("click", function () {
                setTimeout(() => {
                    toggleToolbar();
                }, 50);
            });
        });
    };

    var initSearch = () => {
        const searchInput = document.querySelector('[data-kt-krs-table-filter="search"]');
        searchInput.addEventListener("keyup", function (e) {
            datatable.search(e.target.value).draw();
        });
    };

    var initSemesterFilter = () => {
        const semesterSelect = document.querySelector('[data-kt-krs-table-filter="semester"]');
        const filterButton = document.querySelector('[data-kt-krs-table-filter="filter"]');
        const resetButton = document.querySelector('[data-kt-krs-table-filter="reset"]');
        
        filterButton.addEventListener("click", function () {
            const semester = semesterSelect.value;
            datatable.column(5).search(semester).draw(); // Kolom ke-6 (index 5) untuk semester
        });
        
        resetButton.addEventListener("click", function () {
            semesterSelect.value = "";
            datatable.search("").columns().search("").draw();
        });
    };

    function initKeenMenu() {
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
}
     // Public methods
    return {
        init: function () {
    table = document.querySelector("#kt_krs_table");
    console.log("Table initialized:", table);

    if (!table) {
        console.error("Tabel dengan ID #kt_krs_table tidak ditemukan");
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
                order: [],
                columnDefs: [
                    { orderable: false, targets: 0 }, // Kolom checkbox
                    { orderable: false, targets: 6 }  // Kolom aksi
                ],
                language: {
                    "search": "Cari:",
                    "zeroRecords": "Tidak ada data yang ditemukan",
                    "paginate": {
                        "previous": "Sebelumnya",
                        "next": "Selanjutnya"
                    }
                }
            });

             // Modifikasi event handler draw
    datatable.on("draw", function () {
        initDeleteRow();
        initCheckboxes();
        toggleToolbar();
        
        // Inisialisasi ulang menu setiap kali tabel di-redraw
        setTimeout(initKeenMenu, 100);
    });

            initDeleteRow();
            initDeleteSelected();
            initCheckboxes();
            initSearch();
            initSemesterFilter();
        }
    };
}();

// On document ready dengan fallback jika KTUtil tidak ada
if (typeof KTUtil !== 'undefined' && KTUtil.onDOMContentLoaded) {
    KTUtil.onDOMContentLoaded(function () {
        KTKrsList.init();
    });
} else {
    document.addEventListener("DOMContentLoaded", function() {
        KTKrsList.init();
    });
}