import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Static exchange rates relative to INR (base)
// These are approximate rates — can be upgraded to a live API later
const CURRENCIES = {
    INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee', rate: 1, locale: 'en-IN' },
    USD: { code: 'USD', symbol: '$', name: 'US Dollar', rate: 0.012, locale: 'en-US' },
    EUR: { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.011, locale: 'de-DE' },
    GBP: { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.0095, locale: 'en-GB' },
    HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', rate: 0.093, locale: 'en-HK' },
};

export const CURRENCY_LIST = Object.values(CURRENCIES);

export const useCurrencyStore = create(
    persist(
        (set, get) => ({
            currency: CURRENCIES.INR,
            ratesLoaded: false,

            setCurrency: (code) => {
                const currency = CURRENCIES[code];
                if (currency) {
                    set({ currency });
                }
            },

            fetchRates: async () => {
                try {
                    const response = await fetch('https://open.er-api.com/v6/latest/INR');
                    const data = await response.json();

                    if (data && data.rates) {
                        // Update the static rates with live api rates where available
                        Object.keys(CURRENCIES).forEach(code => {
                            if (data.rates[code]) {
                                CURRENCIES[code].rate = data.rates[code];
                            }
                        });

                        // Also trigger a re-render by updating state
                        set({ ratesLoaded: true });
                    }
                } catch (error) {
                    console.error('Failed to fetch live currency rates:', error);
                }
            },

            // Convert INR price to selected currency
            convert: (priceInINR) => {
                const { rate } = get().currency;
                return Math.round(priceInINR * rate * 100) / 100;
            },

            // Format a price in INR to the selected currency string
            formatPrice: (priceInINR) => {
                const { code, locale } = get().currency;
                const converted = get().convert(priceInINR);
                return new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: code,
                    minimumFractionDigits: 0,
                    maximumFractionDigits: code === 'INR' ? 0 : 2,
                }).format(converted);
            },
        }),
        {
            name: 'aradhya-currency',
        }
    )
);
