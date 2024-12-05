import { useDispatch, useSelector } from 'react-redux';
import { setIsOpenTablePlan } from '../redux/planTableExtend/planTableExtend';
import useTable from './useTable';

const useTableListOpen = () => {
    const dispatch = useDispatch();
    const isOpen = useSelector((state) => state.planTableExtend.isOpen);
    const { resetFilter } = useTable();

    const handleCloseTableList = () => {
        resetFilter();
        dispatch(setIsOpenTablePlan(false));
    };
    const handleOpenTableList = () => {
        dispatch(setIsOpenTablePlan(true));
    };

    return { isOpen, handleCloseTableList, handleOpenTableList };
};

export default useTableListOpen;
