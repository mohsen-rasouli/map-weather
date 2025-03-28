// تشخیص نوع دستگاه
const isMobile = window.innerWidth <= 767;
const isTablet = window.innerWidth > 767 && window.innerWidth <= 1200;
const isDesktop = window.innerWidth > 1200;
const isSmallMobile = window.innerWidth <= 480;

// تنظیم ارتفاع نقشه براساس دستگاه
function setMapHeight() {
    const mapElement = document.getElementById('map');
    
    if (isDesktop) {
        mapElement.style.minHeight = '700px';
    } else if (isTablet) {
        mapElement.style.minHeight = '500px';
    } else if (isMobile) {
        mapElement.style.minHeight = '400px';
    } else if (isSmallMobile) {
        mapElement.style.minHeight = '350px';
    }
}

// تنظیم اولیه ارتفاع نقشه
setMapHeight();

// تنظیم مجدد ارتفاع نقشه با تغییر اندازه صفحه
window.addEventListener('resize', function() {
    const newIsMobile = window.innerWidth <= 767;
    const newIsTablet = window.innerWidth > 767 && window.innerWidth <= 1200;
    const newIsDesktop = window.innerWidth > 1200;
    const newIsSmallMobile = window.innerWidth <= 480;
    
    // فقط در صورت تغییر نوع دستگاه، ارتفاع نقشه تغییر کند
    if (newIsMobile !== isMobile || newIsTablet !== isTablet || 
        newIsDesktop !== isDesktop || newIsSmallMobile !== isSmallMobile) {
        
        // بروزرسانی متغیرهای جهانی
        window.isMobile = newIsMobile;
        window.isTablet = newIsTablet;
        window.isDesktop = newIsDesktop;
        window.isSmallMobile = newIsSmallMobile;
        
        setMapHeight();
    }
});

// نمایش شاخص نوع دستگاه در حالت توسعه
function showDeviceIndicator() {
    const indicator = document.querySelector('.device-indicator');
    if (indicator) {
        let deviceType = 'Desktop';
        if (isSmallMobile) deviceType = 'Small Mobile';
        else if (isMobile) deviceType = 'Mobile';
        else if (isTablet) deviceType = 'Tablet';
        
        indicator.textContent = deviceType + ' - ' + window.innerWidth + 'px';
        indicator.style.display = 'block';
    }
}

// فقط در محیط توسعه فعال شود
// showDeviceIndicator();
// window.addEventListener('resize', showDeviceIndicator);

// تنظیم نقشه
let map;
let fullscreenMode = false;

// تنظیم مرکز نقشه روی ایران
const iranCenter = [28.8737674,52.7462416];
const defaultZoom = 6.5;

// تعریف محدوده ایران برای محدود کردن نقشه
// محدوده جغرافیایی ایران (جنوب غربی و شمال شرقی)
const southWest = L.latLng(24.5, 44.0); // نقطه جنوب غربی ایران
const northEast = L.latLng(40.0, 63.5); // نقطه شمال شرقی ایران
const iranBounds = L.latLngBounds(southWest, northEast);

// ایجاد نقشه با محدودیت‌های ایران
map = L.map('map', {
    center: iranCenter,
    zoom: defaultZoom,
    zoomControl: false,
    attributionControl: false,
    maxBounds: iranBounds, // محدود کردن پن کردن به محدوده ایران
    minZoom: 5, // حداقل زوم مجاز
    maxZoom: 10, // حداکثر زوم مجاز
    maxBoundsViscosity: 0.9 // مقاومت در برابر پن کردن خارج از محدوده (1.0 = کاملاً مقاوم، کمتر = اثر بازگشت)
});

// افزودن افکت بصری هنگام تلاش برای پیمایش خارج از محدوده
map.on('drag', function() {
    // بررسی اگر مرکز نقشه خارج از محدوده مجاز است
    if (!iranBounds.contains(map.getCenter())) {
        // افزودن کلاس بصری برای نشان دادن محدودیت
        document.getElementById('map').classList.add('map-boundary-hit');
        
        // حذف کلاس پس از مدت کوتاهی
        setTimeout(function() {
            document.getElementById('map').classList.remove('map-boundary-hit');
        }, 200);
    }
});

// اضافه کردن کنترل زوم در سمت چپ
L.control.zoom({
    position: 'topleft'
}).addTo(map);

// اضافه کردن نقشه پایه استاندارد
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

// اضافه کردن اطلاعات حق نشر در پایین
L.control.attribution({
    position: 'bottomleft'
}).addAttribution('© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>').addTo(map);

// داده‌های استان‌های ایران
const iranProvinces = [
    { name: "تهران", lat: 35.6892, lon: 51.3890 },
    { name: "اصفهان", lat: 32.6546, lon: 51.6680 },
    { name: "مشهد", lat: 36.2605, lon: 59.6168 },
    { name: "شیراز", lat: 29.5926, lon: 52.5836 },
    { name: "تبریز", lat: 38.0800, lon: 46.2919 },
    { name: "کرمانشاه", lat: 34.3277, lon: 47.0778 },
    { name: "اهواز", lat: 31.3183, lon: 48.6706 },
    { name: "قم", lat: 34.6416, lon: 50.8746 },
    { name: "کرمان", lat: 30.2839, lon: 57.0834 },
    { name: "رشت", lat: 37.2809, lon: 49.5924 },
    { name: "همدان", lat: 34.7990, lon: 48.5148 },
    { name: "اراک", lat: 34.0954, lon: 49.7013 },
    { name: "یزد", lat: 31.8974, lon: 54.3569 },
    { name: "ارومیه", lat: 37.5527, lon: 45.0760 },
    { name: "زاهدان", lat: 29.4963, lon: 60.8629 },
    { name: "سنندج", lat: 35.3219, lon: 46.9862 },
    { name: "خرم‌آباد", lat: 33.4872, lon: 48.3558 },
    { name: "گرگان", lat: 36.8427, lon: 54.4378 },
    { name: "ساری", lat: 36.5633, lon: 53.0601 },
    { name: "بندرعباس", lat: 27.1888, lon: 56.2786 },
    { name: "اردبیل", lat: 38.2498, lon: 48.2933 },
    { name: "بجنورد", lat: 37.4761, lon: 57.3317 },
    { name: "بوشهر", lat: 28.9234, lon: 50.8203 },
    { name: "بیرجند", lat: 32.8649, lon: 59.2262 },
    { name: "زنجان", lat: 36.6736, lon: 48.4787 },
    { name: "سمنان", lat: 35.5729, lon: 53.3971 },
    { name: "قزوین", lat: 36.2797, lon: 50.0049 },
    { name: "شهرکرد", lat: 32.3256, lon: 50.8644 },
    { name: "یاسوج", lat: 30.6682, lon: 51.5881 },
    { name: "ایلام", lat: 33.6374, lon: 46.4153 },
    { name: "فارس", lat: 29.1044, lon: 53.0459 }
];

// تعیین مقیاس مارکرها براساس دستگاه
function getMarkerScale() {
    if (isSmallMobile) return 0.65;  // کوچکتر برای موبایل کوچک
    if (isMobile) return 0.75;       // کوچکتر برای موبایل
    if (isTablet) return 0.85;       // کمی کوچکتر برای تبلت
    return 1;                       // اندازه کامل برای دسکتاپ
}

// دریافت اطلاعات آب و هوا از API
async function fetchWeatherForProvince(province) {
    try {
        // آدرس API
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${province.lat}&longitude=${province.lon}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&timezone=auto`;
        
        const response = await fetch(url);
        
        // بررسی وضعیت پاسخ
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // بررسی اینکه داده‌های دریافتی معتبر هستند
        if (!data || !data.current) {
            throw new Error("داده‌های نامعتبر دریافت شد");
        }
        
        // تبدیل کد آب و هوای Open-Meteo به کد مشابه OpenWeatherMap
        const weatherCode = data.current.weather_code;
        const iconInfo = getWeatherIconFromCode(weatherCode);
        
        return {
            name: province.name,
            lat: province.lat,
            lon: province.lon,
            temp: Math.round(data.current.temperature_2m),
            weatherId: weatherCode,
            weatherCode: weatherCode,
            weatherMain: iconInfo.main,
            weatherDescription: iconInfo.description,
            icon: iconInfo.icon,
            humidity: data.current.relative_humidity_2m,
            precipitation: data.current.precipitation,
            windSpeed: data.current.wind_speed_10m,
            time: new Date(data.current.time),
            units: {
                temp: data.current_units.temperature_2m,
                humidity: data.current_units.relative_humidity_2m,
                precipitation: data.current_units.precipitation,
                windSpeed: data.current_units.wind_speed_10m
            }
        };
    } catch (error) {
        console.error(`خطا در دریافت اطلاعات آب و هوا برای ${province.name}:`, error);
        
        // برگرداندن داده مصنوعی برای نمایش آیکون به جای خطا
        return {
            name: province.name,
            lat: province.lat,
            lon: province.lon,
            temp: Math.round(10 + Math.random() * 20), // دمای تصادفی بین 10 تا 30 درجه
            weatherId: 0,
            weatherCode: 0,
            weatherMain: "Clear",
            weatherDescription: "آسمان صاف",
            icon: "wi-day-sunny",
            humidity: 60,
            precipitation: 0,
            windSpeed: 2.5,
            time: new Date(),
            isFallback: true, // نشان‌دهنده داده مصنوعی
            units: {
                temp: "°C",
                humidity: "%",
                precipitation: "mm",
                windSpeed: "km/h"
            }
        };
    }
}

// تبدیل کد آب و هوای Open-Meteo به آیکون و توضیحات
function getWeatherIconFromCode(code) {
    // جدول تبدیل کدهای آب و هوای Open-Meteo به آیکون و توضیحات
    // https://open-meteo.com/en/docs
    const codeMapping = {
        0: { icon: "wi-day-sunny", main: "Clear", description: "آسمان صاف" },
        1: { icon: "wi-day-sunny", main: "Clear", description: "عمدتاً صاف" },
        2: { icon: "wi-day-cloudy", main: "Partly Cloudy", description: "نیمه ابری" },
        3: { icon: "wi-cloud", main: "Cloudy", description: "ابری" },
        45: { icon: "wi-fog", main: "Fog", description: "مه" },
        48: { icon: "wi-fog", main: "Fog", description: "مه همراه با یخ‌زدگی" },
        51: { icon: "wi-sprinkle", main: "Drizzle", description: "نم‌نم باران، شدت کم" },
        53: { icon: "wi-sprinkle", main: "Drizzle", description: "نم‌نم باران، شدت متوسط" },
        55: { icon: "wi-sprinkle", main: "Drizzle", description: "نم‌نم باران، شدت زیاد" },
        56: { icon: "wi-sleet", main: "Freezing Drizzle", description: "نم‌نم باران یخ‌زده، شدت کم" },
        57: { icon: "wi-sleet", main: "Freezing Drizzle", description: "نم‌نم باران یخ‌زده، شدت زیاد" },
        61: { icon: "wi-rain", main: "Rain", description: "باران، شدت کم" },
        63: { icon: "wi-rain", main: "Rain", description: "باران، شدت متوسط" },
        65: { icon: "wi-rain", main: "Rain", description: "باران، شدت زیاد" },
        66: { icon: "wi-sleet", main: "Freezing Rain", description: "باران یخ‌زده، شدت کم" },
        67: { icon: "wi-sleet", main: "Freezing Rain", description: "باران یخ‌زده، شدت زیاد" },
        71: { icon: "wi-snow", main: "Snow", description: "برف، شدت کم" },
        73: { icon: "wi-snow", main: "Snow", description: "برف، شدت متوسط" },
        75: { icon: "wi-snow", main: "Snow", description: "برف، شدت زیاد" },
        77: { icon: "wi-snow", main: "Snow Grains", description: "دانه‌های برف" },
        80: { icon: "wi-showers", main: "Rain Showers", description: "رگبار باران، شدت کم" },
        81: { icon: "wi-showers", main: "Rain Showers", description: "رگبار باران، شدت متوسط" },
        82: { icon: "wi-showers", main: "Rain Showers", description: "رگبار باران، شدت زیاد" },
        85: { icon: "wi-snow", main: "Snow Showers", description: "بارش برف، شدت کم" },
        86: { icon: "wi-snow", main: "Snow Showers", description: "بارش برف، شدت زیاد" },
        95: { icon: "wi-thunderstorm", main: "Thunderstorm", description: "رعد و برق" },
        96: { icon: "wi-thunderstorm", main: "Thunderstorm", description: "رعد و برق با تگرگ، شدت کم" },
        99: { icon: "wi-thunderstorm", main: "Thunderstorm", description: "رعد و برق با تگرگ، شدت زیاد" }
    };

    return codeMapping[code] || { icon: "wi-day-sunny", main: "Unknown", description: "نامشخص" };
}

// تبدیل وضعیت آب و هوا به فارسی بر اساس کد آب و هوای Open-Meteo
function getWeatherInPersian(weatherCode) {
    const code = parseInt(weatherCode);
    const iconInfo = getWeatherIconFromCode(code);
    return iconInfo.description;
}

// ایجاد مارکر آب و هوا برای استان
function createWeatherMarker(weatherData) {
    // انتخاب آیکون مناسب
    const iconClass = weatherData.icon || "wi-day-sunny";
    const weatherInPersian = weatherData.weatherDescription || getWeatherInPersian(weatherData.weatherCode);
    
    // تعیین رنگ پس‌زمینه بر اساس دما
    let bgColor = "#ffffff";
    let textColor = "#1e293b";
    
    if (weatherData.temp >= 35) {
        bgColor = "#fdba74"; // نارنجی برای دمای بالا
        textColor = "#7c2d12";
    } else if (weatherData.temp >= 25) {
        bgColor = "#fef3c7"; // زرد برای دمای گرم
        textColor = "#92400e";
    } else if (weatherData.temp <= 5) {
        bgColor = "#bfdbfe"; // آبی برای دمای سرد
        textColor = "#1e40af";
    } else if (weatherData.temp <= 0) {
        bgColor = "#dbeafe"; // آبی روشن برای دمای زیر صفر
        textColor = "#1e3a8a";
    }
    
    // اضافه کردن پرچم برای استان‌های بوشهر و فارس - غیرفعال شده
    let provinceHighlight = '';
    let sizeMultiplier = 1;
    
    /* تنظیم نشانگر ویژه و اندازه بزرگتر برای بوشهر و فارس - غیرفعال شده
    if (weatherData.name === "بوشهر") {
        provinceHighlight = `<div style="position: absolute; top: -10px; left: -10px; background: #ef4444; color: white; border-radius: 4px; padding: 2px 4px; font-size: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">بوشهر</div>`;
        sizeMultiplier = 1.4; // 40% بزرگتر
        bgColor = "#fecaca"; // رنگ متفاوت برای بوشهر
    } else if (weatherData.name === "فارس") {
        provinceHighlight = `<div style="position: absolute; top: -10px; left: -10px; background: #3b82f6; color: white; border-radius: 4px; padding: 2px 4px; font-size: 10px; font-weight: bold; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">فارس</div>`;
        sizeMultiplier = 1.4; // 40% بزرگتر
        bgColor = "#bfdbfe"; // رنگ متفاوت برای فارس
    }
    */
    
    // اضافه کردن علامت هشدار برای داده‌های مصنوعی
    const fallbackIndicator = weatherData.isFallback ? 
        `<div style="position: absolute; top: -5px; right: -5px; background: #ef4444; color: white; border-radius: 50%; width: 14px; height: 14px; font-size: 10px; display: flex; align-items: center; justify-content: center;">!</div>` : '';
    
    // تنظیم اندازه آیکون براساس نوع دستگاه و اهمیت استان
    const baseScale = getMarkerScale();
    const scale = baseScale * sizeMultiplier;
    const size = Math.round(70 * scale);
    const fontSize = Math.round(30 * scale);
    const textSize = Math.round(14 * scale);
    
    // تغییر ضخامت حاشیه برای استان‌های مهم - غیرفعال شده
    /* 
    const border = (weatherData.name === "بوشهر" || weatherData.name === "فارس") ? 
        `border: 3px solid ${weatherData.name === "بوشهر" ? "#ef4444" : "#3b82f6"};` : '';
    */
    const border = ''; // حذف حاشیه ویژه
    
    // ایجاد آیکون سفارشی برای مارکر
    const icon = L.divIcon({
        className: 'weather-marker-icon',
        html: `
            <div style="background-color: ${bgColor}; border-radius: 50%; width: ${size}px; height: ${size}px; display: flex; 
                 flex-direction: column; justify-content: center; align-items: center; box-shadow: 0 4px 6px rgba(0,0,0,0.1); position: relative; ${border}">
                ${fallbackIndicator}
                ${provinceHighlight}
                <i class="wi ${iconClass}" style="font-size: ${fontSize}px; color: ${textColor};"></i>
                <div style="font-weight: bold; margin-top: 4px; color: ${textColor}; font-size: ${textSize}px;">${weatherData.temp}°C</div>
            </div>
        `,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2],
        popupAnchor: [0, -(size/2)]
    });
    
    // پیام برای داده‌های مصنوعی
    const fallbackMessage = weatherData.isFallback ? 
        '<div style="color: #ef4444; font-size: 12px; margin-top: 5px;">اطلاعات تخمینی (خطا در اتصال به API)</div>' : '';
    
    // اضافه کردن اطلاعات بارش در صورت وجود
    const precipitationInfo = weatherData.precipitation > 0 ? 
        `<div>بارش: ${weatherData.precipitation} ${weatherData.units?.precipitation || 'mm'}</div>` : '';
    
    // ایجاد پاپ‌آپ با اطلاعات آب و هوا
    const popupContent = `
        <div class="weather-popup">
            <h3>${weatherData.name}</h3>
            <div class="temp">${weatherData.temp}°C</div>
            <div class="weather-condition">
                <i class="wi ${iconClass}"></i>
                <span>${weatherInPersian}</span>
            </div>
            <div class="details">
                <div>رطوبت: ${weatherData.humidity}%</div>
                ${precipitationInfo}
                <div>سرعت باد: ${weatherData.windSpeed} ${weatherData.units?.windSpeed || 'km/h'}</div>
                <div>بروزرسانی: ${weatherData.time.toLocaleTimeString("fa-IR")}</div>
            </div>
            ${fallbackMessage}
        </div>
    `;
    
    const marker = L.marker([weatherData.lat, weatherData.lon], { icon: icon })
        .bindPopup(popupContent, { minWidth: isMobile ? 150 : 200 });
    
    // ذخیره داده‌های آب و هوا در مارکر برای استفاده مجدد
    marker.weatherData = weatherData;
    
    return marker;
}

// لایه‌ای برای نگهداری تمام مارکرها
const markersLayer = L.layerGroup().addTo(map);

// برجسته کردن استان‌های بوشهر و فارس - غیرفعال شده
function highlightBushehrAndFars() {
    /* غیرفعال شده
    // یافتن استان‌های بوشهر و فارس
    const bushehr = iranProvinces.find(p => p.name === "بوشهر");
    const fars = iranProvinces.find(p => p.name === "فارس");
    
    if (bushehr && fars) {
        // اضافه کردن دایره بزرگتر برای نمایش اهمیت این استان‌ها
        L.circle([bushehr.lat, bushehr.lon], {
            color: '#ef4444',
            fillColor: '#fee2e2',
            fillOpacity: 0.3,
            radius: 25000,
            weight: 2
        }).addTo(map);
        
        L.circle([fars.lat, fars.lon], {
            color: '#3b82f6',
            fillColor: '#dbeafe',
            fillOpacity: 0.3,
            radius: 25000,
            weight: 2
        }).addTo(map);
    }
    */
    // تابع در حالت غیرفعال - برای استفاده در آینده
    return;
}

// دریافت و نمایش اطلاعات آب و هوا برای تمام استان‌ها
async function fetchAllWeatherData() {
    // نمایش ارورلی
    document.querySelector('.loading-overlay').style.display = 'flex';
    
    // پاک کردن مارکرهای قبلی
    markersLayer.clearLayers();
    
    try {
        // دریافت اطلاعات آب و هوا برای همه استان‌ها به صورت موازی
        const weatherDataPromises = iranProvinces.map(province => fetchWeatherForProvince(province));
        const weatherDataList = await Promise.all(weatherDataPromises);
        
        // ایجاد مارکر برای هر استان
        weatherDataList.forEach(weatherData => {
            const marker = createWeatherMarker(weatherData);
            markersLayer.addLayer(marker);
        });
        
        // برجسته کردن استان‌های بوشهر و فارس - در حال حاضر غیرفعال
        // highlightBushehrAndFars();
        
    } catch (error) {
        console.error('خطا در دریافت اطلاعات آب و هوا:', error);
        alert('مشکلی در دریافت اطلاعات آب و هوا رخ داد. لطفاً دوباره تلاش کنید.');
    } finally {
        // مخفی کردن ارورلی
        document.querySelector('.loading-overlay').style.display = 'none';
    }
}

// دکمه بروزرسانی
document.querySelector('.refresh-btn').addEventListener('click', fetchAllWeatherData);

// دکمه راهنمای نقشه
document.querySelector('.toggle-legend-btn').addEventListener('click', function() {
    const legend = document.querySelector('.legend');
    
    if (legend.style.display === 'none' || !legend.style.display) {
        legend.style.display = 'block';
    } else {
        legend.style.display = 'none';
    }
});

// دکمه تمام‌صفحه
document.querySelector('.fullscreen-btn').addEventListener('click', function() {
    toggleFullscreen();
});

// تغییر وضعیت تمام‌صفحه
function toggleFullscreen() {
    const container = document.querySelector('.container');
    
    if (!fullscreenMode) {
        // ورود به حالت تمام‌صفحه
        container.classList.add('fullscreen-container');
        
        // ایجاد دکمه بستن
        const closeButton = document.createElement('button');
        closeButton.className = 'fullscreen-close';
        closeButton.innerHTML = '&times;';
        closeButton.addEventListener('click', toggleFullscreen);
        container.appendChild(closeButton);
        
        fullscreenMode = true;
        
        // تنظیم مجدد نقشه
        setTimeout(() => {
            map.invalidateSize();
            // اطمینان از محدودیت مجدد نقشه به منطقه ایران
            map.fitBounds(iranBounds);
            map.setMinZoom(5);
            map.setMaxBounds(iranBounds);
        }, 100);
    } else {
        // خروج از حالت تمام‌صفحه
        container.classList.remove('fullscreen-container');
        
        // حذف دکمه بستن
        const closeButton = document.querySelector('.fullscreen-close');
        if (closeButton) {
            closeButton.remove();
        }
        
        fullscreenMode = false;
        
        // تنظیم مجدد نقشه
        setTimeout(() => {
            map.invalidateSize();
            // اطمینان از محدودیت مجدد نقشه به منطقه ایران
            map.setView(iranCenter, defaultZoom);
        }, 100);
    }
}

// بارگذاری اولیه اطلاعات آب و هوا
document.addEventListener('DOMContentLoaded', function() {
    // نمایش مرز ایران روی نقشه
    showIranBorder();
    
    // بارگذاری اطلاعات آب و هوا
    fetchAllWeatherData();
});

// تابع نمایش مرز ایران روی نقشه
function showIranBorder() {
    // استفاده از داده GeoJSON برای مرز دقیق ایران
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(response => response.json())
        .then(data => {
            const iran = data.features.find(country => country.properties.ADMIN === 'Iran');
            if (iran) {
                L.geoJSON(iran, {
                    style: {
                        color: '#2563eb',
                        weight: 2,
                        opacity: 0.8,
                        fillColor: '#dbeafe',
                        fillOpacity: 0.2
                    }
                }).addTo(map);
            }
        })
        .catch(error => {
            console.error("Error loading Iran boundary:", error);
        });
} 