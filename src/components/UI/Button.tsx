import { Spin } from 'antd';
import React from 'react';


interface IButtonProps {
    loading?: boolean;
    children?: React.ReactNode,
    onClick?:() => void;
    className?: string;
};

const Button = ({loading=false, children, className='', ...props}:IButtonProps) => {
  return (
    <button {...props} className={`purple-button ${className}`}>
        {loading ? <Spin size='default'/> : children}
    </button>
  )
}

export default Button;