import { Modal } from 'antd';
import React, { ReactNode, useEffect, useState } from 'react';
import { ModalProps } from 'antd';
import { IoCloseCircleOutline } from 'react-icons/io5';

type CustomProps = {
    children: ReactNode
};

const CustomModal = ({children, ...rest}: CustomProps & ModalProps) => {
    const [client, setClient] = useState(false);
    useEffect(() => setClient(true),[]);

return (
    <>
        {
            client && 
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
        }
    </>
) 

};

export default CustomModal;