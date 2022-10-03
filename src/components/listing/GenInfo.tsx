import React, { useRef, useState } from 'react';
import { Footer, NavBar, DatePicker } from '../../components';
import { BsArrowLeftCircle } from 'react-icons/bs';
import { BiCurrentLocation } from 'react-icons/bi';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Checkbox, Col, Form, Input, Radio, Row, Space, Upload } from 'antd';
import ImgCrop from 'antd-img-crop';
import { Widget, WidgetAPI } from '@uploadcare/react-widget';
import { FaCloudUploadAlt } from 'react-icons/fa';

const GeneralInfo = ({setStep}:{setStep: React.Dispatch<React.SetStateAction<string>>}) => {

    const widgetRef = useRef<WidgetAPI | null>(null);
    const widgetRef2 = useRef<WidgetAPI | null>(null);
    const widgetRef3 = useRef<WidgetAPI | null>(null);
    const widgetRef4 = useRef<WidgetAPI | null>(null);
    const [fileList, setFileList] = useState<UploadFile[]>([
        {
          uid: '-1',
          name: 'image.png',
          status: 'done',
          url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
        },
      ]);
    
    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
      };

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
          src = await new Promise(resolve => {
            const reader = new FileReader();
            reader.readAsDataURL(file.originFileObj as RcFile);
            reader.onload = () => resolve(reader.result as string);
          });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow?.document.write(image.outerHTML);
      };

return (
        <Form 
            className='mt-10'
            labelCol={{span: 24}}
            wrapperCol={{span: 24}}
            >
            <Form.Item 
                label="Add Photos">
                {/* <ImgCrop rotate>
                    <Upload
                        fileList={fileList}
                        onChange={onChange}
                        onPreview={onPreview}
                        listType='picture-card' >
                        {fileList.length < 5 && '+ Upload'}
                    </Upload>
                </ImgCrop> */}
                <div className="grid grid-cols-4 gap-10">
                    <div onClick={() => widgetRef?.current?.openDialog()} className="border rounded-lg p-10 cursor-pointer flex justify-center items-center text-primary">
                        <FaCloudUploadAlt className="text-3xl" />
                        <span className='hidden'>
                            <Widget
                            ref={widgetRef}
                            publicKey={`${process.env.NEXT_PUBLIC_UPLOAD_CARE_KEY}`}
                            previewStep={true}
                        />
                        </span>
                    </div>
                    <div onClick={() => widgetRef2?.current?.openDialog()} className="border rounded-lg p-10 cursor-pointer flex justify-center items-center text-primary">
                        <FaCloudUploadAlt className="text-3xl" />
                        <span className='hidden'>
                            <Widget
                                ref={widgetRef2}
                                publicKey={`${process.env.NEXT_PUBLIC_UPLOAD_CARE_KEY}`}
                                previewStep={true}
                                />
                        </span>
                    </div>
                    <div onClick={() => widgetRef3?.current?.openDialog()} className="border rounded-lg p-10 cursor-pointer flex justify-center items-center text-primary">
                        <FaCloudUploadAlt className="text-3xl" />
                        <span className='hidden'>
                            <Widget
                        ref={widgetRef3}
                        publicKey={`${process.env.NEXT_PUBLIC_UPLOAD_CARE_KEY}`}
                        previewStep={true}
                        />
                        </span>
                    </div>
                    <div onClick={() => widgetRef4?.current?.openDialog()} className="border rounded-lg p-10 cursor-pointer flex justify-center items-center text-primary">
                        <FaCloudUploadAlt className="text-3xl" />
                        <span className='hidden'>
                            <Widget
                        ref={widgetRef4}
                        publicKey={`${process.env.NEXT_PUBLIC_UPLOAD_CARE_KEY}`}
                        previewStep={true}
                        />
                        </span>
                    </div>
                </div>
                <p className="w-full text-right text-[#98989E] text-lg my-5">
                    Click to reorder, crop or add photos
                </p>
            </Form.Item>
            <Form.Item label="Listing Title">
                <Input placeholder='Enter' />
            </Form.Item>
            <Form.Item label="Category">
                <Input placeholder='Enter' />
            </Form.Item>
            <Form.Item label="Description">
                <Input.TextArea placeholder='Enter' className='min-h-24 h-24' />
            </Form.Item>
            <Row gutter={65}>
                <Col span={12}>
                    <Form.Item label="Location">
                        <Input placeholder='Enter' />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Item Value">
                        <Input placeholder='Enter' />
                    </Form.Item>
                </Col>
            </Row>
            <h2 className="font-lota text-2xl font-semibold text-primary mt-12 mb-8">Rent Price Per:</h2>
            <Row gutter={65}>
                <Col span={8}>
                    <Form.Item label="Day">
                        <Input placeholder='Enter' />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Weeks">
                        <Input placeholder='Enter' />
                    </Form.Item>
                </Col>
                <Col span={8}>
                    <Form.Item label="Months">
                        <Input placeholder='Enter' />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={65}>
                <Col span={12}>
                    <Form.Item label="Quantity">
                        <Input placeholder='Enter' />
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="Minimum Rental Days">
                        <Input placeholder='Enter' />
                    </Form.Item>
                </Col>
            </Row>
            <h3 className="font-lota text-lg mt-12">Availability Exceptions</h3>
            <div className="w-full flex justify-center items-center">
                <DatePicker />
            </div>
            <Form.Item>
                <Checkbox name='availability' className='checkbox-label'>
                    Always Available
                </Checkbox>
            </Form.Item>
            <div className="mt-6 flex justify-end gap-5">
                <button className='w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold'>
                    Cancel
                </button>
                <button onClick={() => setStep('location')} className='w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold'>
                    Next
                </button>
            </div>
        </Form>
) 

};

export default GeneralInfo;