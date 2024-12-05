import { createSelector } from '@reduxjs/toolkit';
import { filterByDate, filterByLandArea, filterByPriceRange } from '../../constants/filter';

const selectListMarker = (state) => state.listMarker;
const selectFilters = (state) => state.filter;

const getLandAreaRange = (id) => {
    switch (id) {
        case 1:
            return { min: 0, max: 200 };
        case 2:
            return { min: 200, max: 500 };
        case 3:
            return { min: 500, max: 1000 };
        case 4:
            return { min: 1000, max: Infinity };
        default:
            return { min: 0, max: Infinity };
    }
};

const getPriceRange = (id) => {
    switch (id) {
        case 1:
            return { min: 0, max: 500000000 };
        case 2:
            return { min: 500000000, max: 1000000000 };
        case 3:
            return { min: 1000000000, max: 2000000000 };
        case 4:
            return { min: 2000000000, max: 4000000000 };
        case 5:
            return { min: 4000000000, max: 10000000000 };
        case 6:
            return { min: 10000000000, max: Infinity };
        default:
            return { min: 0, max: Infinity };
    }
};

// Map house filter values to typeArea strings
const getHouseType = (id) => {
    switch (id) {
        case 1:
            return 'Nhà bán';
        case 2:
            return 'Đất bán';
       
        default:
            return 'Nhà bán';
    }
};

export const selectFilteredMarkers = createSelector(
    [selectListMarker, selectFilters],
    (listMarker, filters) => {
        if (!listMarker) return [];

        // Nếu tất cả các bộ lọc đều trống, trả về toàn bộ mảng marker ban đầu
        // const noFiltersSelected = 
        //     filters.house.length === 0 && 
        //     filters.date.length === 0 && 
        //     filters.landArea.length === 0 && 
        //     filters.priceRange.length === 0;

        // if (noFiltersSelected) {
        //     return listMarker;
        // }

        return listMarker.filter((item) => {
            const houseMatch = filters.house?.length === 0 || (function() {
                const type = getHouseType(filters.house?.[0])
                return item.typeArea === type;
            })();

            const dateMatch = filters.date?.length === 0 || (function () {
                const dateFilter = filterByDate.find((filter) => filter.id === filters.date?.[0]); // Assuming single filter ID is stored
                if (!dateFilter) return false;

                const dateAdded = new Date(item.addAt);
                const now = new Date();
                const daysSinceAdded = Math.floor((now - dateAdded) / (1000 * 60 * 60 * 24));

                switch (filters.date[0]) { // Assuming single filter ID is stored
                    case 1:
                        return daysSinceAdded <= 90;
                    case 2:
                        return daysSinceAdded > 90 && daysSinceAdded <= 180;
                    case 3:
                        return daysSinceAdded > 180 && daysSinceAdded <= 360;
                    case 4:
                        return daysSinceAdded > 360;
                    default:
                        return false;
                }
            })();

            const landAreaMatch = filters.landArea?.length === 0 || (function () {
                const rangeId = filters.landArea?.[0];
                const { min, max } = getLandAreaRange(rangeId);
                return item.area >= min && item.area <= max;
            })();

            const priceRangeMatch = filters.priceRange?.length === 0 || (function () {
                const rangeId = filters.priceRange?.[0];
                const { min, max } = getPriceRange(rangeId);
                return item.priceOnM2 >= min && item.priceOnM2 <= max;
            })();

            return houseMatch && dateMatch && landAreaMatch && priceRangeMatch;
        });
    }
);
