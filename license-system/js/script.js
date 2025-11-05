// تابع برای تنظیم خودکار لایسنس در فیلد ورودی
function setLicenseKey(key) {
    document.getElementById('licenseKey').value = key;
    document.getElementById('licenseKey').focus();
}

// تابع اصلی اعتبارسنجی لایسنس
async function validateLicense() {
    const licenseKey = document.getElementById('licenseKey').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!licenseKey) {
        showResult('error', 'لطفاً یک کلید لایسنس وارد کنید');
        return;
    }
    
    // نمایش حالت لودینگ
    showResult('loading', 'در حال بررسی لایسنس...', 'لطفاً چند لحظه صبر کنید');
    
    try {
        // دریافت داده‌های لایسنس از فایل JSON
        const response = await fetch('data/licenses.json');
        const data = await response.json();
        
        // شبیه‌سازی تأخیر شبکه
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const licenseData = data.licenses[licenseKey];
        
        if (licenseData && licenseData.status === 'active') {
            showSuccessResult(licenseData);
        } else {
            showResult('error', 
                'لایسنس نامعتبر است یا وجود ندارد',
                'لطفاً از صحت کلید وارد شده اطمینان حاصل کنید'
            );
        }
        
    } catch (error) {
        showResult('error', 
            'خطا در ارتباط با سرور',
            `خطای فنی: ${error.message}`
        );
    }
}

// تابع نمایش نتیجه
function showResult(type, title, message = '') {
    const resultDiv = document.getElementById('result');
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        loading: 'fas fa-spinner fa-spin'
    };
    const titles = {
        success: 'لایسنس معتبر است',
        error: 'خطا در اعتبارسنجی',
        loading: 'در حال بررسی لایسنس...'
    };
    
    resultDiv.innerHTML = `
        <h3><i class="${icons[type]}"></i> ${title}</h3>
        ${message ? `<p>${message}</p>` : ''}
    `;
    resultDiv.className = `result ${type}`;
    resultDiv.style.display = 'block';
}

// تابع نمایش نتیجه موفق
function showSuccessResult(licenseData) {
    const resultDiv = document.getElementById('result');
    
    resultDiv.innerHTML = `
        <h3><i class="fas fa-check-circle"></i> لایسنس معتبر است</h3>
        <p>لایسنس وارد شده با موفقیت تأیید شد و فعال است.</p>
        
        <div class="license-info">
            <div class="info-item">
                <strong>مشتری</strong>
                ${licenseData.customer_name}
            </div>
            <div class="info-item">
                <strong>محصول</strong>
                ${licenseData.product}
            </div>
            <div class="info-item">
                <strong>تاریخ انقضا</strong>
                ${licenseData.expiry_date}
            </div>
            <div class="info-item">
                <strong>فعال‌سازی</strong>
                ${licenseData.used_activations} از ${licenseData.max_activations}
            </div>
            <div class="info-item">
                <strong>سطح پشتیبانی</strong>
                ${licenseData.support_tier}
            </div>
            <div class="info-item">
                <strong>روزهای باقی‌مانده</strong>
                ${licenseData.remaining_days} روز
            </div>
        </div>
        
        <div style="margin-top: 20px; padding: 15px; background: rgba(16, 185, 129, 0.1); border-radius: 12px; border-right: 4px solid var(--success);">
            <strong>ویژگی‌های فعال:</strong>
            <div style="margin-top: 10px; display: flex; gap: 10px; flex-wrap: wrap;">
                ${licenseData.features.map(feature => 
                    `<span style="background: white; padding: 6px 12px; border-radius: 20px; font-size: 13px; border: 1px solid var(--success); color: var(--success);">${feature}</span>`
                ).join('')}
            </div>
        </div>
    `;
    resultDiv.className = 'result success';
    resultDiv.style.display = 'block';
}

// فعال کردن دکمه با کلید Enter
document.getElementById('licenseKey').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        validateLicense();
    }
});

// شبیه‌سازی آمار زنده
function updateLiveStats() {
    setInterval(() => {
        const validatedToday = document.getElementById('validatedToday');
        const current = parseInt(validatedToday.textContent);
        validatedToday.textContent = current + Math.floor(Math.random() * 3);
    }, 5000);
}

// راه‌اندازی آمار زنده
document.addEventListener('DOMContentLoaded', function() {
    updateLiveStats();
});