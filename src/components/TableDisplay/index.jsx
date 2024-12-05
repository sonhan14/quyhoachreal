import React, { memo } from 'react';
import { Table } from 'antd';

const TableDisplay = ({ dataSource, columns, onFilter = () => {}, currentPage }) => {
    const onChange = (pagi, filters, sorter) => {
        onFilter(pagi.current, filters, sorter);
    };

    return (
        <Table
            rowKey="id"
            bordered={true}
            loading={!dataSource}
            onChange={onChange}
            columns={columns}
            dataSource={dataSource}
            pagination={{ pageSize: 10, current: currentPage }}
        />
    );
};
export default TableDisplay;
