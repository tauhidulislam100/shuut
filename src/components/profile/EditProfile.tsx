import { Col, Divider, Form, Input, Row } from 'antd';
import React from 'react';

const { TextArea } = Input;

const EditProfile = () => {

return (
    <div className="mt-20">
        <h1 className="text-primary font-semibold font-lota text-2xl">Edit Profile</h1>
        <div className="border border-[#DFDFE6] rounded-[10px] bg-[#FCFCFD] mt-[60px]">
            <Form
                labelCol={{span: 24}}
                wrapperCol={{span: 24}}
                size="large"
                className='px-10  py-5'>
                <Row gutter={87}>
                    <Col span={12}>
                        <Form.Item label="First Name" >
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Last Name"  className="">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Divider />
                <Form.Item label="Description">
                    <TextArea rows={8} />
                </Form.Item>
                <Divider />
                <h2 className="text-left text-2xl">Address</h2>
                <Row gutter={87}>
                    <Col span={12}>
                        <Form.Item label="House No.">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Street">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={87}>
                    <Col span={12}>
                        <Form.Item label="City">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Country">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
                <Form.Item label="Phone Number">
                    <Input />
                </Form.Item>
                <Form.Item label="Advance">
                    <Input />
                </Form.Item>
                <Form.Item label="business Name">
                    <Input />
                </Form.Item>
                <Form.Item label="Store Location">
                    <Input />
                </Form.Item>
                <Row gutter={87}>
                    <Col span={12}>
                        <Form.Item label="Opening Hours">
                            <Input />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="Closing Hours">
                            <Input />
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
        </div>
        <div className="mt-6 flex justify-end gap-5">
            <button className='w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold'>
                Cancel
            </button>
            <button className='w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold'>
                Save Changes
            </button>
        </div>
    </div>
) 

};

export default EditProfile;