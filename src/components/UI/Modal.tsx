import { Modal } from 'antd';
import React, { ReactNode } from 'react';
import { ModalProps } from 'antd';
import { IoCloseCircleOutline } from 'react-icons/io5';

type CustomProps = {
    children: ReactNode
};

const CustomModal = ({children, ...rest}: CustomProps & ModalProps) => {

return (
    <Modal  
        {...rest}
        centered
        footer={null}
        closeIcon={<div className='pt-5'><IoCloseCircleOutline className='text-2xl' /></div>}
        maskStyle={{
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(255,255,255,0.5)'}}
        >
        {children}
    </Modal>
) 

};

export default CustomModal;