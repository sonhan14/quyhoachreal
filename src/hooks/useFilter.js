import _ from 'lodash';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { resetQuery, setQuery } from '../redux/filterSliceTable/filterSliceTable';

const useFilter = () => {
    const dispatch = useDispatch();
    const { query } = useSelector((state) => state.filterSliceTable);
    const { pathname } = useLocation();
    const [searchParams] = useSearchParams();
    const navigator = useNavigate();
    useEffect(() => {
        const params = {};
        searchParams?.forEach((value, key) => {
            params[key] = value;
        });
        // @dispatch
        dispatch(setQuery(params));
    }, []);

    const reset = () => {
        dispatch(resetQuery());
        navigator(`${pathname}`);
    };

    const updateQueryParam = (params) => {
        const newParams = new URLSearchParams(searchParams?.toString());
        const checkedParams = _.omitBy(params, (value) => value === undefined || value === '' || value === null);

        Object.entries(params).forEach(([key, value]) => {
            if (value) newParams.set(key, String(value));
            else {
                newParams.delete(key);
            }
        });
        dispatch(setQuery(checkedParams));
        navigator(`${pathname}?${newParams.toString()}`);
    };

    return { query, updateQueryParam, reset };
};

export default useFilter;
