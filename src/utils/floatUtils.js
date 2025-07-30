export function parseLocalizedAmount(value: string | number): number {
    if (typeof value === 'number') return value;

    let str = value.trim();

    if (str.includes(',') && str.includes('.')) {
        if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
            str = str.replace(/\./g, '').replace(',', '.'); // 19.731,25 → 19731.25
        } else {
            str = str.replace(/,/g, ''); // 19,731.25 → 19731.25
        }
    } else if (str.includes(',')) {
        str = str.replace(/\./g, '').replace(',', '.'); // 19731,25 → 19731.25
    } else {
        str = str.replace(/,/g, ''); // 19731.25 → 19731.25
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