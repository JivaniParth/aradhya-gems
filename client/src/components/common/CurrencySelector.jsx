import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useCurrencyStore, CURRENCY_LIST } from '../../store/useCurrencyStore';

export default function CurrencySelector() {
    const { currency, setCurrency } = useCurrencyStore();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 text-sm font-medium text-secondary bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg transition-colors"
                aria-label="Select currency"
            >
                <span className="hidden sm:inline">{currency.code} ({currency.symbol})</span>
                <span className="sm:hidden">{currency.symbol}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 animate-in fade-in slide-in-from-top-1 duration-150">
                    {CURRENCY_LIST.map((curr) => (
                        <button
                            key={curr.code}
                            onClick={() => {
                                setCurrency(curr.code);
                                setIsOpen(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between transition-colors ${currency.code === curr.code
                                ? 'bg-primary/5 text-primary font-medium'
                                : 'text-secondary hover:bg-gray-50'
                                }`}
                        >
                            <span>{curr.code} ({curr.symbol})</span>
                            {currency.code === curr.code && (
                                <span className="text-primary text-xs">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
