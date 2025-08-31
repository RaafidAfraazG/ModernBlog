// client/src/components/UI/SearchBox.js
import React, { useState } from 'react';

const SearchBox = ({ onSearch, placeholder = "Search posts..." }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="search-input"
        />
        <button type="submit" className="search-btn">
          🔍
        </button>
      </form>
      {searchTerm && (
        <button 
          onClick={handleClear}
          style={{
            position: 'absolute',
            right: '52px',
            top: '50%',
            transform: 'translateY(-50%)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '18px'
          }}
        >
          ❌
        </button>
      )}
    </div>
  );
};

export default SearchBox;