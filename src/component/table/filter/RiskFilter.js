import React, { useState } from 'react'
import SelectHeaderFilter from '../SelectHeaderFilter'

function RiskFilter(params) {
    const [status, setStatus] = useState("all")

    return (
        <SelectHeaderFilter
        {...params}
        label="Seç"
        externalValue="all"
        isServer
        options={[
            { value: 'all', label: 'Tümü' },
            { value: 'risk_yok', label: 'Risk Yok' },
            { value: 'gecikmede', label: 'Gecikmede' },
            { value: 'ihtar_cekilecek', label: 'İhtar Çekilecek' },
            { value: 'ihtar_cekildi', label: 'İhtar Çekildi' },
            { value: 'fesih_edilecek', label: 'Fesih Edilecek' },
        ]}
        />
    )
}

export default RiskFilter
