import React from 'react';

const CurrencyFormatter = ({ amount }) => {
    // Fungsi untuk memformat angka menjadi format mata uang Rupiah
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <span>
            {formatCurrency(amount)}
        </span>
    );
};

export default CurrencyFormatter