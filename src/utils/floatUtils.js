export function parseLocalizedAmount(value: string | number): number {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;

    let str = String(value).trim();

    const hasComma = str.includes(',');
    const hasDot = str.includes('.');

    // "1.234,56" veya "1,234.56" formatlarını ele al
    if (hasComma && hasDot) {
        if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
            // Türkçe format: 1.234,56 -> 1234.56
            str = str.replace(/\./g, '').replace(',', '.');
        } else {
            // İngilizce format: 1,234.56 -> 1234.56
            str = str.replace(/,/g, '');
        }
    } else if (hasComma) {
        // Sadece virgül varsa ondalık ayıracıdır: 1234,56 -> 1234.56
        str = str.replace(',', '.');
    } else if (hasDot) {
        // Sadece nokta varsa, binlik ayıracı mı ondalık mı kontrol et
        const parts = str.split('.');
        if (parts.length === 2 && parts[1].length === 3 && parts[0].length <=3) {
             // 100.000 gibi binlik ayıracı
            str = str.replace(/\./g, '');
        }
        // Aksi halde "100.50" gibi ondalık kabul edilir ve bir şey yapmaya gerek kalmaz.
    }

    const parsed = parseFloat(str);
    return isNaN(parsed) ? 0 : parsed;
}

export function amountFormatter(value)  {
    const rawValue = value;

    // Eğer zaten sayıysa, direkt formatla
    if (typeof rawValue === 'number') {
        return new Intl.NumberFormat('tr-TR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(rawValue);
    }

    // Eğer string geldiyse, Türkçe formatı normalize et
    if (typeof rawValue === 'string') {
        let s = rawValue.trim();

        if (s.includes(',') && s.includes('.')) {
            if (s.lastIndexOf(',') > s.lastIndexOf('.')) {
                s = s.replace(/\./g, '').replace(',', '.');
            } else {
                s = s.replace(/,/g, '');
            }
        } else if (s.includes(',')) {
            s = s.replace(/\./g, '').replace(',', '.');
        } else {
            s = s.replace(/,/g, '');
        }

        const parsed = parseFloat(s);
        if (!isNaN(parsed)) {
            return new Intl.NumberFormat('tr-TR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }).format(parsed);
        }
    }

    // formatlanamıyorsa orijinalini döndür
    return rawValue;
}