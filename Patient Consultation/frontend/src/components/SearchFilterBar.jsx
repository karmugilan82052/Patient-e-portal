import React from 'react';

const SearchFilterBar = ({
    searchTerm,
    onSearchChange,
    statusFilter,
    onStatusFilterChange,
    showStatusFilter = true,
    sortOrder,
    onSortOrderChange,
    totalCount = 0,
    filteredCount = 0
}) => {
    return (
        <div className="search-filter-container">
            <div className="search-input-wrapper">
                <span className="search-icon">🔍</span>
                <input
                    type="text"
                    className="search-input"
                    placeholder="Search by patient, symptoms, or issues..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
                {searchTerm && (
                    <button
                        className="btn-clear-search"
                        onClick={() => onSearchChange('')}
                        title="Clear search"
                    >
                        ✕
                    </button>
                )}
            </div>

            <div className="filter-controls">
                {showStatusFilter && (
                    <div className="filter-group">
                        <label className="filter-label">Status:</label>
                        <select
                            className="filter-select"
                            value={statusFilter}
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                        >
                            <option value="ALL">All Statuses</option>
                            <option value="PENDING">Pending Only</option>
                            <option value="CONFIRMED">Confirmed Only</option>
                        </select>
                    </div>
                )}

                {onSortOrderChange && (
                    <div className="filter-group">
                        <label className="filter-label">Sort:</label>
                        <select
                            className="filter-select"
                            value={sortOrder}
                            onChange={(e) => onSortOrderChange(e.target.value)}
                        >
                            <option value="NEWEST">Newest First</option>
                            <option value="OLDEST">Oldest First</option>
                        </select>
                    </div>
                )}
            </div>

            <div className="search-results-count">
                Showing <strong>{filteredCount}</strong> of {totalCount} records
            </div>
        </div>
    );
};

export default SearchFilterBar;

