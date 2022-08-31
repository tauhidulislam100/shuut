import { Modal } from 'antd';
import React, { useEffect, useState } from 'react';

const Test = () => {

    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        setShowModal(true);
    },[])

return (
    <div className="h-screen min-h-screen bg-white">
        {
            showModal && 
            <Modal centered visible={true}>
                <div className="">
                    dlkjfkdjkd
                </div>
            </Modal>
        }
    </div>
) 

};

export default Test;