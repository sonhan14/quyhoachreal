import React from 'react';
import { CheckedSquareIcon, CheckSquareIcon } from '../Icons';
import './Checkbox.scss'


const Checkbox = ({ title, id, onChange, checked, color }) => (
    <label style={{width: '100%',cursor: 'pointer' ,display: 'flex', alignItems: 'center', marginBottom: '8px', backgroundColor: checked ? `${color ? '#B74C00' :'#3E6B00'}` : '#C9C9C9'}} className='checkbox--container'>
        <input type="checkbox" id={id} checked={checked} onChange={onChange} style={{ display: 'none' }} />
        {checked ? <CheckedSquareIcon /> : <CheckSquareIcon />}
        <span style={{ marginLeft: '8px', color: checked ? '#fff' : '#000', fontWeight: 400, fontSize: '16px' }}>{title}</span>
    </label>
);

export default Checkbox;
