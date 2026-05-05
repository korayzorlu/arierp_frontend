import React, { useState } from 'react'
import SelectHeaderFilter from '../SelectHeaderFilter'

function CurrencyFilter(params) {
    const [status, setStatus] = useState("all")

    return (
        <SelectHeaderFilter
        {...params}
        label="Seç"
        externalValue="all"
        isServer
        options={[
            { value: 'all', label: 'Tümü' },
            { value: 'TRY', label: 'TRY' },
            { value: 'USD', label: 'USD' },
            { value: 'EUR', label: 'EUR' },
        ]}
        />
    )
}

export default CurrencyFilter
