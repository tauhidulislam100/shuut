import { useQuery } from "@apollo/client";
import { Col, Divider, Form, Input, Row, Spin } from "antd";
import React from "react";
import { GET_USER_INFO_BY_ID } from "../../graphql/query_mutations";
import { useAuth } from "../../hooks/useAuth";

const { TextArea } = Input;

const EditProfile = ({
  data,
  address,
  loading,
  onChange,
  onChangeAddress,
  onSave,
}: {
  data: Record<string, any>;
  address: Record<string, any>;
  loading?: boolean;
  onChange?: (name: string, value: string) => void;
  onChangeAddress?: (name: string, value: string) => void;
  onSave?: () => void;
}) => {
  return (
    <div className="mt-20">
      <h1 className="text-primary font-semibold font-lota text-2xl">
        Edit Profile
      </h1>
      <div className="border border-[#DFDFE6] rounded-[10px] bg-[#FCFCFD] mt-[60px]">
        <Form
          labelCol={{ span: 24 }}
          wrapperCol={{ span: 24 }}
          size="large"
          className="!px-10  !py-5"
        >
          <Row gutter={87}>
            <Col span={24} md={12}>
              <Form.Item label="First Name">
                <Input
                  value={data?.firstName}
                  name="firstName"
                  onChange={(e) => onChange?.("firstName", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item label="Last Name" className="">
                <Input
                  value={data?.lastName}
                  onChange={(e) => onChange?.("lastName", e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Divider />
          <Form.Item label="Description">
            <TextArea
              rows={8}
              value={data?.description}
              onChange={(e) => onChange?.("description", e.target.value)}
            />
          </Form.Item>
          <Divider />
          <h2 className="text-left text-2xl">Address</h2>
          <Form.Item label="State">
            <Input
              value={address?.state}
              onChange={(e) => onChangeAddress?.("state", e.target.value)}
            />
          </Form.Item>
          <Row gutter={87}>
            <Col span={24} md={12}>
              <Form.Item label="City">
                <Input
                  value={address?.city}
                  onChange={(e) => onChangeAddress?.("city", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item label="Country">
                <Input
                  value={address?.country}
                  onChange={(e) => onChangeAddress?.("country", e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Delivery Address">
            <TextArea
              rows={3}
              value={address?.delivery_address}
              onChange={(e) =>
                onChangeAddress?.("delivery_address", e.target.value)
              }
            />
          </Form.Item>
          <Form.Item label="Phone Number">
            <Input
              value={data?.phone}
              onChange={(e) => onChange?.("phone", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Advance">
            <Input
              value={data?.advance}
              onChange={(e) => onChange?.("advance", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="business Name">
            <Input
              value={data?.business_name}
              onChange={(e) => onChange?.("business_name", e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Store Location">
            <Input
              value={data?.store_location}
              onChange={(e) => onChange?.("store_location", e.target.value)}
            />
          </Form.Item>
          <Row gutter={87}>
            <Col span={24} md={12}>
              <Form.Item label="Opening Hours">
                <Input
                  value={data?.opening_hours}
                  onChange={(e) => onChange?.("opening_hours", e.target.value)}
                />
              </Form.Item>
            </Col>
            <Col span={24} md={12}>
              <Form.Item label="Closing Hours">
                <Input
                  value={data?.closing_hours}
                  onChange={(e) => onChange?.("closing_hours", e.target.value)}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="mt-6 flex justify-end gap-5">
        <button className="w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold">
          Cancel
        </button>
        <button
          onClick={onSave}
          className="w-[193px] purple-button font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold"
        >
          {loading ? <Spin size="small" /> : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
