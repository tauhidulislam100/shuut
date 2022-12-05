import Image from 'next/image';
import React from 'react';

const CheckPhoto = () => {

return (
    <div className="mt-5 px-40">
        <h1 className="text-[32px] font-lota font-semibold text-primary">
            Check Your Photo
        </h1>
        <p className="font-lota text-lg">
            Make sure lighting is good and lettering is clear before continuing.
        </p>
        <div className="mt-12 flex justify-center">
            <div className="flex rounded-[5px] overflow-hidden p-2 border">
                <div className="relative w-[200px] h-[250px] rounded-tl-[5px] rounded-bl-[5px] overflow-hidden">
                    <Image
                        src={'/images/photo.png'}
                        alt="Photo 1"
                        layout='fill'
                        objectFit="cover"
                        />
                </div>
                <div className="relative w-[200px] h-[250px] rounded-tr-[5px] rounded-br-[5px] overflow-hidden">
                    <Image
                        src={'/images/photo2.png'}
                        alt="Photo 1"
                        layout='fill'
                        />
                </div>
            </div>
        </div>
        <div className="mt-12 flex justify-end gap-5">
            <button onClick={() => console.log("Button!")} className='w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold'>
                Use This Photo
            </button>
            <button onClick={() => console.log("Button!")} className='min-w-[193px] px-8 font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold'>
                Retake Photo
            </button>
        </div>
        <div className="border rounded-[5px] mt-10 bg-[#FCFCFD] font-lota">
            <p className="p-8">
                By continuing i acknowledge that Matis biom, 
                By continuing i acknowledge that Matis biom,
                By continuing i acknowledge that Matis biom,
            </p>
        </div>
    </div>
) 

};

export default CheckPhoto;