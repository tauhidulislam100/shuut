import React, { useEffect, useState } from 'react';
import { Modal } from '../components';

const Test = () => {

    const [showModal, setShowModal] = useState(false);
    useEffect(() => {
        setShowModal(true);
    },[])

return (
    <div className="h-screen min-h-screen bg-blue-500">
        <p className="">Who is the author?</p>
        {
             <Modal visible={true}>
                <p className="">Testing modal</p>
                <p className="">Testing modal</p>
                <p className="">Testing modal</p>
                <p className="">Testing modal</p>
                <p className="">Testing modal</p>
                <p className="">Testing modal</p>
                <p className="">Testing modal</p>
                <p className="">Testing modal</p>
             </Modal>
        }
    </div>
) 

};

export default Test;