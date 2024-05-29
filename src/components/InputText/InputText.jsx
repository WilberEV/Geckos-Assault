import React from 'react';

export const InputText = ({type, className, placeholder, name, defaultValue, handler}) => {

    return (
        <div className='inputTextDesign'>
            <input 
                type={type}
                className={className}
                placeholder={placeholder}
                name={name}
                defaultValue={defaultValue}
                onChange={(e)=>handler(e)}
            />
        </div>
    )
}