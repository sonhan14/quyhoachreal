import TableDisplay from '../../TableDisplay';
import useTable from '../../../hooks/useTable';
import { useEffect, useState } from 'react';
import { fetchAllProvince, fetchAllQuyHoach, fetchDistrictsByProvinces } from '../../../services/api';

const TablePlans = () => {
    const { getColumnSearchProps, query, getFilteredValue, onFilter } = useTable();
    const [dataSource, setDataSource] = useState([]);
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const filteredProvinces = getFilteredValue('idProvince');

    const currentPage = Number(query.page || 1);

    useEffect(() => {
        (async () => {
            try {
                const plans = await fetchAllQuyHoach();
                const provinces = await fetchAllProvince();
                const districtsPromises = provinces.map((province) =>
                    fetchDistrictsByProvinces(province.TinhThanhPhoID),
                );
                const districtsData = await Promise.all(districtsPromises);
                const districts = districtsData.flat();
                setProvinces(provinces);
                setDistricts(districts);
                const plansDetailsInfo = plans.map((item, i) => {
                    const province = provinces.find((province) => province.TinhThanhPhoID === item.idProvince);
                    const district = districts.find((district) => {
                        return district.DistrictID === item.idDistrict;
                    });
                    if (!province || !district) {
                        return item;
                    }
                    return {
                        ...item,
                        stt: i + 1,
                        provinceName: province.TenTinhThanhPho,
                        districtName: district.DistrictName,
                    };
                });
                setDataSource(plansDetailsInfo);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        })();
    }, []);
    const columns = [
        {
            title: 'STT',
            dataIndex: 'stt',
            key: 'stt',
            render: (_, __, i) => <>{i + 1 + 10 * (currentPage - 1)}</>,
        },
        {
            title: 'Tên quy hoạch',
            dataIndex: 'description',
            key: 'description',
            render: (text) => <h4>{text}</h4>,
            ...getColumnSearchProps('description'),
            width: '20%',
        },
        {
            title: 'Tỉnh/Thành phố',
            dataIndex: 'provinceName',
            key: 'idProvince',
            filters: provinces.map((province) => ({
                text: province.TenTinhThanhPho,
                value: province.TinhThanhPhoID,
            })),
            onFilter: (value, record) => {
                return record.idProvince === value;
            },
            filteredValue: getFilteredValue('idProvince'),
        },

        {
            title: 'Quân/Huyện',
            dataIndex: 'districtName',
            key: 'idDistrict',
            filteredValue: getFilteredValue('idDistrict'),
            filters: districts
                .filter((item) => {
                    if (filteredProvinces) {
                        console.log(filteredProvinces, 'filteredProvinces');
                        return filteredProvinces.includes(String(item.ProvinceID));
                    }
                    return true;
                })
                .map((district) => ({ text: district.DistrictName, value: district.DistrictID })),
            onFilter: (value, record) => {
                return record.idDistrict === value;
            },
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'date',
        },
    ];

    return <TableDisplay dataSource={dataSource} columns={columns} currentPage={currentPage} onFilter={onFilter} />;
};

export default TablePlans;
