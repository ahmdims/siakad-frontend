document.addEventListener('DOMContentLoaded', function() {
    // 1. Inisialisasi Flatpickr untuk tanggal lahir
    $("#kt_datepicker_tanggal_lahir").flatpickr({
        dateFormat: "Y-m-d",
        allowInput: true,
        locale: "id" // Bahasa Indonesia
    });

    // 2. Inisialisasi Select2 dropdown
    $('[data-control="select2"]').select2({
        minimumResultsForSearch: Infinity
    });

    // 3. Fungsi Validasi Form
    const validateForm = () => {
        let isValid = true;
        const form = document.querySelector('form');
        
        // Validasi field required
        const requiredFields = [
            'nama', 'nik', 'tempat_lahir', 'tanggal_lahir',
            'nama_ayah', 'nik_ayah', 'nama_ibu', 'nik_ibu',
            'jenis_kelamin', 'agama'
        ];
        
        requiredFields.forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (!field.value.trim()) {
                showValidationError(field, 'Field ini wajib diisi');
                isValid = false;
            } else if (['nik', 'nik_ayah', 'nik_ibu'].includes(fieldName) && 
                      !/^\d{16}$/.test(field.value.trim())) {
                showValidationError(field, 'NIK harus 16 digit angka');
                isValid = false;
            } else {
                clearValidationError(field);
            }
        });
        
        return isValid;
    };

    // 4. Fungsi Tampilkan Error Validasi
    const showValidationError = (field, message) => {
        const parent = field.closest('.fv-row');
        if (!parent) return;
        
        parent.classList.add('has-error');
        
        let errorElement = parent.querySelector('.invalid-feedback');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'invalid-feedback';
            parent.appendChild(errorElement);
        }
        
        errorElement.textContent = message;
        
        // Untuk Select2
        if (field.classList.contains('select2-hidden-accessible')) {
            const select2Container = parent.querySelector('.select2-container');
            if (select2Container) {
                select2Container.classList.add('is-invalid');
            }
        }
    };
    
    // 5. Fungsi Hapus Error Validasi
    const clearValidationError = (field) => {
        const parent = field.closest('.fv-row');
        if (!parent) return;
        
        parent.classList.remove('has-error');
        
        const errorElement = parent.querySelector('.invalid-feedback');
        if (errorElement) {
            errorElement.textContent = '';
        }
        
        // Untuk Select2
        if (field.classList.contains('select2-hidden-accessible')) {
            const select2Container = parent.querySelector('.select2-container');
            if (select2Container) {
                select2Container.classList.remove('is-invalid');
            }
        }
    };
    
    // 6. Handler Submit Form
    const form = document.querySelector('form');
    const submitBtn = document.getElementById('submitBtn');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        submitBtn.setAttribute('data-kt-indicator', 'on');
        submitBtn.disabled = true;
        
        // Simulasi proses submit
        setTimeout(() => {
            submitBtn.removeAttribute('data-kt-indicator');
            submitBtn.disabled = false;
            
            Swal.fire({
                text: "Biodata berhasil disimpan!",
                icon: "success",
                buttonsStyling: false,
                confirmButtonText: "Ok",
                customClass: {
                    confirmButton: "btn btn-primary"
                }
            });
        }, 1500);
    });
    
    // 7. Handler Reset Form
    form.addEventListener('reset', function() {
        // Reset validasi
        document.querySelectorAll('.invalid-feedback').forEach(el => {
            el.textContent = '';
        });
        
        document.querySelectorAll('.has-error, .is-invalid').forEach(el => {
            el.classList.remove('has-error', 'is-invalid');
        });
        
        // Reset Select2
        $('[data-control="select2"]').val(null).trigger('change');
        
        // Reset Flatpickr
        $("#kt_datepicker_tanggal_lahir").flatpickr().clear();
    });
    
    // 8. Validasi Input NIK (hanya angka, max 16 digit)
    ['nik', 'nik_ayah', 'nik_ibu'].forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('input', function(e) {
                this.value = this.value.replace(/\D/g, '');
                if (this.value.length > 16) {
                    this.value = this.value.slice(0, 16);
                }
            });
        }
    });
});