"use client";

import { useState, useEffect } from "react";

interface CurrencyData {
  rate: number;
  lastUpdated: Date;
  error?: string;
}

const FALLBACK_RATE = 12500; // Fallback rate if API fails
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

let cachedData: CurrencyData | null = null;
let lastFetchTime = 0;

export function useCurrency() {
  const [currencyData, setCurrencyData] = useState<CurrencyData>({
    rate: FALLBACK_RATE,
    lastUpdated: new Date(),
  });
  const [loading, setLoading] = useState(false);

  const fetchCurrencyRate = async () => {
    // Check if we have cached data that's still valid
    const now = Date.now();
    if (cachedData && (now - lastFetchTime) < CACHE_DURATION) {
      setCurrencyData(cachedData);
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch("https://api.lyukirevizor.uz/api/usd-rate");
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.rate && typeof data.rate === 'number') {
        const rate = data.rate;
        
        if (isNaN(rate) || rate <= 0) {
          throw new Error("Invalid rate received from API");
        }
        
        const newData: CurrencyData = {
          rate,
          lastUpdated: new Date(data.updatedAt || new Date()),
        };
        
        // Cache the data
        cachedData = newData;
        lastFetchTime = now;
        
        setCurrencyData(newData);
      } else {
        throw new Error("Invalid data format received from API");
      }
    } catch (error) {
      
      const errorData: CurrencyData = {
        rate: FALLBACK_RATE,
        lastUpdated: new Date(),
        error: error instanceof Error ? error.message : "Unknown error",
      };
      
      setCurrencyData(errorData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencyRate();
  }, []);

  const convertUSDToUZS = (usdAmount: number): number => {
    return Math.round(usdAmount * currencyData.rate);
  };

  const convertUZSToUSD = (uzsAmount: number): number => {
    return Math.round((uzsAmount / currencyData.rate) * 100) / 100; // Round to 2 decimal places
  };

  return {
    rate: currencyData.rate,
    lastUpdated: currencyData.lastUpdated,
    error: currencyData.error,
    loading,
    convertUSDToUZS,
    convertUZSToUSD,
    refresh: fetchCurrencyRate,
  };
}
