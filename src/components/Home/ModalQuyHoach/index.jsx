import '../ModalDown/ModalDownMenu.scss';
import { memo, useEffect, useRef, useState } from 'react';
import { Modal } from 'antd';
import Draggable from 'react-draggable';

import { fetQuyHoachByIdDistrict } from '../../../services/api';
import PlanMapSection from '../../PlanMapSection';

const ModalQuyHoach = (props) => {
    const { isShowModalQuyHoach, handleCloseQuyHoach, idDistrict } = props;
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });
    const draggleRef = useRef(null);

    // const {districtId} = useSelector((state) => state.map);
    const [listQuyHoach, setListQuyHoach] = useState([]);
    const [selectedIDQuyHoach, setSelectedIDQuyHoach] = useState([]);

    const onStart = (_event, uiData) => {
        const { clientWidth, clientHeight } = window.document.documentElement;
        const targetRect = draggleRef.current?.getBoundingClientRect();
        if (!targetRect) {
            return;
        }
        setBounds({
            left: -targetRect.left + uiData.x,
            right: clientWidth - (targetRect.right - uiData.x),
            top: -targetRect.top + uiData.y,
            bottom: clientHeight - (targetRect.bottom - uiData.y),
        });
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetQuyHoachByIdDistrict(idDistrict);
                if (data && data.length > 0) {
                    setListQuyHoach(data);
                } else {
                    setListQuyHoach([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [idDistrict]);

    // useEffect(() => {
    //     const searchParams = new URLSearchParams(location.search);
    //     const quyhoachParam = searchParams.get('quyhoach');
    //     if (quyhoachParam) {
    //         setSelectedIDQuyHoach(quyhoachParam.split(',').map(Number));
    //     }
    // }, [location.search]);

    // useEffect(() => {
    //     const searchParams = new URLSearchParams(location.search);
    //     if (selectedIDQuyHoach.length > 0) {
    //         searchParams.set('quyhoach', selectedIDQuyHoach.join(','));
    //     } else {
    //         searchParams.delete('quyhoach'); // Xóa tham số nếu không có giá trị hợp lệ
    //     }

    //     // Giữ nguyên các tham số khác
    //     navigate({ search: searchParams.toString() });
    // }, [selectedIDQuyHoach]);

    const handleChangeIDQuyHoach = (id) => {
        if (selectedIDQuyHoach?.includes(id)) {
            setSelectedIDQuyHoach(selectedIDQuyHoach.filter((item) => item !== id));
        } else {
            setSelectedIDQuyHoach([...selectedIDQuyHoach, id]);
        }
    };

    return (
        <Modal
            key={1212}
            open={isShowModalQuyHoach}
            onCancel={handleCloseQuyHoach}
            footer={null}
            mask={false}
            modalRender={(modal) => (
                <Draggable
                    disabled={disabled}
                    bounds={bounds}
                    nodeRef={draggleRef}
                    onStart={(event, uiData) => onStart(event, uiData)}
                >
                    <div ref={draggleRef}>{modal}</div>
                </Draggable>
            )}
            title={
                <div
                    style={{
                        width: '100%',
                        cursor: 'move',
                        textAlign: 'center',
                        fontWeight: 700,
                        fontSize: '24px',
                    }}
                    onMouseOver={() => {
                        if (disabled) {
                            setDisabled(false);
                        }
                    }}
                    onMouseOut={() => {
                        setDisabled(true);
                    }}
                    onFocus={() => {}}
                    onBlur={() => {}}
                    // end
                >
                    Quy Hoạch Khác
                </div>
            }
        >
            <div className="menu__container">
                {listQuyHoach &&
                    listQuyHoach.length > 0 &&
                    listQuyHoach.map((item) => (
                        <PlanMapSection
                            key={item.id}
                            quyhoach={item}
                            checked={selectedIDQuyHoach?.includes(item.id)}
                            onChange={() => handleChangeIDQuyHoach(item.id)}
                        />
                    ))}
                {listQuyHoach.length === 0 && <div className="no-data">Dữ liệu đang được biên soạn!</div>}
            </div>
        </Modal>
    );
};

export default memo(ModalQuyHoach);
