import React, { useEffect, useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import Image from 'next/image';
import OtpInput from 'react-otp-input';
import { Modal } from '.';


const Verification = ({visible, onCancel}: {visible: boolean, onCancel: () => void}) => {

    const [client, setClient] = useState<boolean>(false);
    const [phone, setPhone] = useState<string | undefined>();
    const [otp, setOtp] = useState<string | undefined>();
    const [token, setToken] = useState(false);

    

    const enterNumber = (
        <>
            <div className="flex justify-center items-center">
                <Image src="/images/bulb.png" alt="Bulb Icon" width={30} height={30} />
            </div>
            <h1 className="mt-5 text-center font-semibold text-4xl text-primary">Enter Your Phone Number</h1>
            <p className="mt-[18px] text-2xl text-[#010918F7] text-center">
                In order to secure your new SHUUT account we will<br/> 
                need to verify your phone number.
            </p>
            <div className="w-full flex justify-center mt-5">
                <PhoneInput
                    value={phone}
                    country="us"
                    containerClass='w-auto'
                    dropdownClass='bg-white'
                    inputClass='h-10'
                    onChange={num => setPhone(num)} />
            </div>
            <div className="mt-5 flex justify-center">
                <button onClick={() => setToken(true)} className="min-w-[275px] btn px-6 py-5 text-xl bg-secondary text-white">Send Verification Code</button>
            </div>
        </>
    );

const enterToken = (
    <>
        <div className="flex justify-center items-center">
            <Image src="/images/bulb.png" alt="Bulb Icon" width={30} height={30} />
        </div>
        <h1 className="mt-5 text-center font-semibold text-4xl text-primary">Validate Token</h1>
        <p className="mt-[18px] text-2xl text-[#010918F7] text-center">
            An OTP was sent to your phone number {5465545},<br/>
            please check and enter below.
        </p>
        <div className="w-full flex justify-center mt-5">
            <OtpInput
                value={otp}
                onChange={(o:string) => setOtp(o)}
                placeholder="****"
                numInputs={4}
                containerStyle="react-otp-input"
                inputStyle={{
                    width: "3rem",
                    height: "3rem",
                    paddingTop: "5px",
                    margin: "0 0.6rem",
                    fontSize: "2rem",
                    borderRadius: 4,
                    border: "1px solid rgba(0,0,0,0.3)"
                  }}
                 />
        </div>
        <div className="mt-5 flex justify-center">
            <button className="min-w-[275px] btn px-6 py-5 text-xl bg-secondary text-white">Send Verification Code</button>
        </div>
    </>
)


useEffect(() => {
    setClient(true);
},[]);

return (
    <>
        {
            client && 
        <Modal width={935} visible={visible} onCancel={onCancel}>
            <div className="font-lota px-16 py-10">
                {
                    token ? enterToken : enterNumber
                }
            </div>
        </Modal>
        }
    </>
) 

};

export default Verification;