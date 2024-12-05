import { useCallback, useRef, useState } from 'react';
import useFilter from './useFilter';
import _ from 'lodash';
import { Button, Input, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import slugify from 'slugify';
import { useDispatch } from 'react-redux';
import { setPlansInfo } from '../redux/plansSelected/plansSelected';

const removeVietnameseTones = (str) => slugify(str, { replacement: '', lower: true, locale: 'vi' });
const convertObject = (inputObj) => {
    return _.reduce(
        inputObj,
        (result, value, key) => {
            if (_.isArray(value) && !_.isEmpty(value)) {
                result[key] = value.join(',');
            } else if (_.isNull(value) || _.isUndefined(value)) {
                result[key] = ''; // Thay thế null hoặc undefined bằng chuỗi rỗng
            } else {
                result[key] = value;
            }
            return result;
        },
        {},
    );
};

const useTable = () => {
    const [searchText, setSearchText] = useState('');
    const [searchedColumn, setSearchedColumn] = useState('');
    const { query, updateQueryParam, reset } = useFilter();
    const searchInput = useRef(null);
    const dispatch = useDispatch();

    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const resetFilter = () => {
        setSearchText('');
        setSearchedColumn('');
        reset();
        dispatch(setPlansInfo([]));
    };

    const getSortedInfo = (key) => {
        return query.sort
            ? query.sort.includes(key)
                ? query.sort.includes('-')
                    ? 'descend'
                    : 'ascend'
                : undefined
            : undefined;
    };

    const getFilteredValue = (key) => {
        return query[key] ? query[key].split(',') : undefined;
        // return [];
    };

    const handleResetSearch = (clearFilters) => {
        clearFilters();
        setSearchText('');
        updateQueryParam({ ...query, page: '1', search: '', rawsearch: '' });
    };

    const onFilter = (page, filters, sorter) => {
        const filterParams = convertObject(filters);
        const sortColumKey = Array.isArray(sorter) ? sorter[0]?.columnKey : sorter?.columnKey;
        const sortOrder = Array.isArray(sorter) ? sorter[0]?.order : sorter?.order;
        let sortParams = '';
        if (sortColumKey && sortOrder) {
            if (sortOrder === 'ascend') {
                sortParams = `${sortColumKey}`;
            } else {
                sortParams = `-${sortColumKey}`;
            }
        }
        updateQueryParam({ ...query, ...filterParams, sort: sortParams, page: String(page) });
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Nhập giá trị tìm kiếm`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{ marginBottom: 8, display: 'block' }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Tìm kiếm
                    </Button>
                    {/* <Button
                        onClick={() => clearFilters && handleResetSearch(clearFilters)}
                        size="small"
                        style={{ width: 90 }}
                    >
                        Đặt lại
                    </Button> */}
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({ closeDropdown: false });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Lọc
                    </Button>
                    <Button type="link" size="small" onClick={() => close()}>
                        Đóng
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} />,
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        onFilter: (value, record) => {
            const searchValue = removeVietnameseTones(value);
            const recordValue = removeVietnameseTones(record[dataIndex].toString());
            return recordValue.includes(searchValue);
        },

        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ''}
                />
            ) : (
                text
            ),
    });

    return {
        query,
        getSortedInfo,
        getFilteredValue,
        onFilter,
        resetFilter,
        getColumnSearchProps,
    };
};

export default useTable;
