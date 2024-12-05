import './ModalDownMenu.scss';
import { memo, useRef, useState } from 'react';
import { Modal } from 'antd';
import Draggable from 'react-draggable';
import { filterByDate, filterByHouse, filterByLandArea, filterByPriceRange } from '../../../constants/filter';
import Checkbox from '../../Checkbox';
import { useDispatch, useSelector } from 'react-redux';
import { setFilter } from '../../../redux/filter/filterSlice';

const ModalPriceFilter = (props) => {
    const { handleClosePrice, showPrice } = props;
    const [disabled, setDisabled] = useState(true);
    const [bounds, setBounds] = useState({
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
    });
    const draggleRef = useRef(null);

    const dispatch = useDispatch();
    const selectedFilters = useSelector((state) => state.filter);

    const handleCheckboxChange = (category, id) => {
        dispatch(setFilter({ category, id }));
    };

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

    return (
        <Modal
            key={1212}
            open={showPrice}
            onCancel={handleClosePrice}
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
                    BỘ LỌC GIÁ
                </div>
            }
        >
            <div className="">
                <div className="filterByHouse">
                    {filterByHouse.map((item) => (
                        <Checkbox
                            key={item.id}
                            title={item.title}
                            id={item.id}
                            color
                            checked={selectedFilters.house?.includes(item.id)}
                            onChange={() => handleCheckboxChange('house', item.id)}
                        />
                    ))}
                </div>

                <div className="border_bottom-modal"></div>

                {/* <div className="filterByPriceOnM2">
                    {filterByPriceOnM2.map((item) => (
                        <Checkbox
                            key={item.id}
                            title={item.title}
                            id={item.id}
                            checked={selectedFilters.priceOnM2?.includes(item.id)}
                            onChange={() => handleCheckboxChange('priceOnM2', item.id)}
                        />
                    ))}
                </div> */}
                {/* <div className="border_bottom-modal"></div> */}

                <div className="filterByDate">
                    {filterByDate.map((item) => (
                        <Checkbox
                            key={item.id}
                            title={item.title}
                            id={item.id}
                            checked={selectedFilters.date?.includes(item.id)}
                            onChange={() => handleCheckboxChange('date', item.id)}
                        />
                    ))}
                </div>
                <div className="border_bottom-modal"></div>

                <div className="filterByLandArea">
                    {filterByLandArea.map((item) => (
                        <Checkbox
                            key={item.id}
                            title={item.title}
                            id={item.id}
                            color
                            checked={selectedFilters.landArea?.includes(item.id)}
                            onChange={() => handleCheckboxChange('landArea', item.id)}
                        />
                    ))}
                </div>
                <div className="border_bottom-modal"></div>

                <div className="filterByPriceRange">
                    {filterByPriceRange.map((item) => (
                        <Checkbox
                            key={item.id}
                            title={item.title}
                            id={item.id}
                            checked={selectedFilters.priceRange?.includes(item.id)}
                            onChange={() => handleCheckboxChange('priceRange', item.id)}
                        />
                    ))}
                </div>
            </div>
        </Modal>
    );
};

export default memo(ModalPriceFilter);
