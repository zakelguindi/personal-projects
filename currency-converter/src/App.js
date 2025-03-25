import { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [fromCurrency, setFromCurrency] = useState('EUR');
  const [toCurrency, setToCurrency] = useState('USD');
  const [amount, setAmount] = useState('');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [currenciesLoading, setCurrenciesLoading] = useState(true);
  const fromDropdownRef = useRef(null);
  const toDropdownRef = useRef(null);

  // Fetch all available currencies
  useEffect(() => {
    const fetchCurrencies = async () => {
      setCurrenciesLoading(true);
      try {
        const response = await fetch('https://api.frankfurter.app/currencies');
        if (!response.ok) {
          throw new Error('Failed to fetch currencies');
        }
        const data = await response.json();
        const currencyList = Object.entries(data).map(([code, name]) => ({
          code,
          name
        }));
        setCurrencies(currencyList);
      } catch (err) {
        console.error('Failed to fetch currencies:', err);
        setError('Failed to load currency list. Please refresh the page.');
      } finally {
        setCurrenciesLoading(false);
      }
    };
    fetchCurrencies();
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fromDropdownRef.current && !fromDropdownRef.current.contains(event.target)) {
        setShowFromDropdown(false);
      }
      if (toDropdownRef.current && !toDropdownRef.current.contains(event.target)) {
        setShowToDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchConversion = async () => {
      if (!amount) {
        setConvertedAmount('');
        return;
      }
      
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching conversion from ${fromCurrency} to ${toCurrency}`);
        const response = await fetch(`https://api.frankfurter.app/latest?base=${fromCurrency}&symbols=${toCurrency}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch conversion rate: ${response.status}`);
        }
        const data = await response.json();
        console.log('Conversion data:', data);
        
        if (!data.rates || !data.rates[toCurrency]) {
          throw new Error('Invalid conversion rate data received');
        }
        
        const rate = data.rates[toCurrency];
        const result = rate * Number(amount);
        console.log(`Conversion result: ${amount} ${fromCurrency} = ${result} ${toCurrency}`);
        setConvertedAmount(result);
      } catch (err) {
        console.error('Conversion error:', err);
        setError(`Failed to fetch conversion rate: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchConversion();
  }, [fromCurrency, toCurrency, amount]);

  const filteredCurrencies = currencies.filter(currency => 
    currency.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    currency.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCurrencyName = (code) => {
    const currency = currencies.find(c => c.code === code);
    return currency ? `${code} - ${currency.name}` : code;
  };

  const renderDropdown = (isFrom) => {
    if (currenciesLoading) {
      return (
        <div className="dropdown">
          <div className="currency-option">Loading currencies...</div>
        </div>
      );
    }

    return (
      <div className="dropdown">
        <input
          type="text"
          placeholder="Search currency..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <div className="currency-list">
          {filteredCurrencies.length === 0 ? (
            <div className="currency-option">No currencies found</div>
          ) : (
            filteredCurrencies.map((currency) => (
              <div
                key={currency.code}
                className="currency-option"
                onClick={() => {
                  if (isFrom) {
                    setFromCurrency(currency.code);
                    setShowFromDropdown(false);
                  } else {
                    setToCurrency(currency.code);
                    setShowToDropdown(false);
                  }
                  setSearchTerm('');
                }}
              >
                {currency.code} - {currency.name}
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Currency Converter</h1>
        <div className="converter-container">
          <div className="input-group">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0"
              step="0.01"
              placeholder="Enter amount"
            />
            <div className="dropdown-container" ref={fromDropdownRef}>
              <div 
                className="currency-selector"
                onClick={() => {
                  setShowFromDropdown(!showFromDropdown);
                  setShowToDropdown(false);
                }}
              >
                {getCurrencyName(fromCurrency)}
              </div>
              {showFromDropdown && renderDropdown(true)}
            </div>
          </div>
          
          <div className="input-group">
            <input
              type="number"
              value={convertedAmount || ''}
              readOnly
            />
            <div className="dropdown-container" ref={toDropdownRef}>
              <div 
                className="currency-selector"
                onClick={() => {
                  setShowToDropdown(!showToDropdown);
                  setShowFromDropdown(false);
                }}
              >
                {getCurrencyName(toCurrency)}
              </div>
              {showToDropdown && renderDropdown(false)}
            </div>
          </div>

          {loading && <p>Loading conversion...</p>}
          {error && <p className="error">{error}</p>}
        </div>

        {/* <div className="scatter-plot-section">
          <CurrencyScatterPlot currencies={currencies} />
        </div> */}
      </header>
    </div>
  );
}

export default App;
