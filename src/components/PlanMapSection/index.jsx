import React from 'react';
import '../Home/ModalDown/ModalDownMenu.scss';
// import anhDemo from '../../assets/test1.jpg';
const PlanMapSection = ({ quyhoach, onChange, checked }) => {
    return (
        <label className="menu__section" style={{ backgroundColor: checked ? '#3e6a00' : '' }}>
            <input type="checkbox" id={quyhoach.id} checked={checked} onChange={onChange} style={{ display: 'none' }} />
            {/* <img src={anhDemo} alt="anhQuyHoach" className="menu__image" /> */}
            <p className="menu--desc" style={{ color: checked ? '#fff' : '' }}>
                {quyhoach.description}
            </p>
        </label>
    );
};

export default PlanMapSection;
