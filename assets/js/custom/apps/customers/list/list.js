/**
 * SIAKAD - Dashboard Mahasiswa Custom JS
 * Universitas Muhammadiyah Ponorogo
 */

"use strict";

// Class definition
var KTAppMahasiswaDashboard = function() {
    // Private variables
    var table;

    // Private functions
    var initPaymentTable = function() {
        // Initialize DataTable for payment status
        table = $('#kt_payment_table').DataTable({
            responsive: true,
            language: {
                lengthMenu: "Tampilkan _MENU_ data",
                search: "_INPUT_",
                searchPlaceholder: "Cari tagihan...",
                info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ tagihan",
                paginate: {
                    previous: "<i class='ki-duotone ki-arrow-left fs-3'></i>",
                    next: "<i class='ki-duotone ki-arrow-right fs-3'></i>"
                }
            },
            dom: '<"top"f>rt<"bottom"ip><"clear">',
            pageLength: 10,
            order: [[0, 'asc']],
            columnDefs: [
                { orderable: false, targets: [0, 4] }, // Disable sorting on No and Status columns
                { className: "text-center", targets: [0, 4] }, // Center align No and Status
                { width: "5%", targets: 0 }, // No column width
                { width: "20%", targets: 3 } // Amount column width
            ],
            drawCallback: function() {
                // Update badge colors based on status
                $('.badge-light-success').addClass('bg-success text-white');
                $('.badge-light-warning').addClass('bg-warning text-white');
            }
        });

        // Add filter for payment status
        $('#kt_payment_filter').on('change', function() {
            const status = $(this).val();
            if (status === 'all') {
                table.search('').columns().search('').draw();
            } else {
                table.column(4).search(status).draw();
            }
        });
    };

    var initPrintButton = function() {
        $('#kt_print_btn').on('click', function(e) {
            e.preventDefault();
            
            // Create a print-friendly version of the table
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Status Pembayaran Mahasiswa</title>
                        <style>
                            body { font-family: Arial; margin: 20px; }
                            h1 { color: #2b2b2b; margin-bottom: 20px; }
                            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                            th { background-color: #f5f8fa; text-align: left; padding: 8px; border: 1px solid #ddd; }
                            td { padding: 8px; border: 1px solid #ddd; }
                            .badge { padding: 3px 6px; border-radius: 4px; font-size: 12px; }
                            .success { background-color: #50cd89; color: white; }
                            .warning { background-color: #ffc700; color: white; }
                            .text-center { text-align: center; }
                            .text-right { text-align: right; }
                            .footer { margin-top: 30px; font-size: 12px; text-align: center; }
                        </style>
                    </head>
                    <body>
                        <h1>Status Pembayaran Mahasiswa</h1>
                        ${$('#kt_payment_table').clone().removeAttr('id').prop('outerHTML')}
                        <div class="footer">
                            Dicetak dari SIAKAD Universitas Muhammadiyah Ponorogo<br>
                            Tanggal: ${new Date().toLocaleDateString('id-ID')}
                        </div>
                    </body>
                </html>
            `);
            printWindow.document.close();
            printWindow.print();
        });
    };

    var initTotalCalculation = function() {
        // Calculate and display totals
        const paidTotal = 5250000;
        const unpaidTotal = 4500000;
        
        $('#kt_payment_paid_total').text(formatCurrency(paidTotal));
        $('#kt_payment_unpaid_total').text(formatCurrency(unpaidTotal));
    };

    var formatCurrency = function(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Public methods
    return {
        init: function() {
            initPaymentTable();
            initPrintButton();
            initTotalCalculation();
            
            // Initialize tooltips
            $('[data-bs-toggle="tooltip"]').tooltip();
        }
    };
}();

// On document ready
if (typeof KTUtil !== 'undefined') {
    KTUtil.onDOMContentLoaded(function() {
        KTAppMahasiswaDashboard.init();
    });
} else {
    document.addEventListener('DOMContentLoaded', function() {
        KTAppMahasiswaDashboard.init();
    });
}