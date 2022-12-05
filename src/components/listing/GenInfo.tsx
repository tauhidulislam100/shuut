import React, { useEffect, useRef, useState } from "react";
import { DatePicker } from "../../components";
import { AutoComplete, Checkbox, Col, Form, Input, InputRef, Row } from "antd";
import {
  FilesUpload,
  FileUpload,
  Widget,
  WidgetAPI,
} from "@uploadcare/react-widget";
import { FaCloudUploadAlt } from "react-icons/fa";
interface IProps {
  categories: Record<string, any>[];
  data: Record<string, any>;
  isInvalid: boolean;
  onSubmit: () => void;
  onChange?: (name: string, value: any) => void;
}

const GeneralInfo = ({
  onSubmit,
  onChange,
  categories,
  data,
  isInvalid,
}: IProps) => {
  const autocomplete = useRef<google.maps.places.Autocomplete | null>(null);
  const locationRef = useRef<HTMLInputElement>(null);
  const [locationValue, setLocationValue] = useState<string>(
    data.location?.name
  );
  const [pricing, setPricing] = useState<Record<string, number | string>>({
    daily_price: data.daily_price,
    weekly_price: data.weekly_price,
    monthly_price: data.monthly_price,
  });
  const widgetRef = useRef<WidgetAPI | null>(null);
  const [fileList, setFileList] = useState<string[]>(data.images ?? []);

  const onDialogClose = async (info: FileUpload | FilesUpload | null) => {
    const files = [];
    if ((info as any)?.files) {
      for (const file of (info as any)?.files()) {
        files.push((await file.promise()).cdnUrl);
      }
    }
    setFileList([...files]);
    onChange?.("images", files);
  };

  const getValue = (id: number) => {
    if (!id) return null;
    return categories?.find((item) => item.id === id)?.name;
  };

  useEffect(() => {
    if (!autocomplete.current && locationRef.current) {
      autocomplete.current = new google.maps.places.Autocomplete(
        locationRef.current,
        {
          fields: ["formatted_address", "geometry", "name", "vicinity"],
        }
      );
      autocomplete.current.addListener("place_changed", () => {
        const place = autocomplete.current?.getPlace()!;
        onChange?.("location", {
          name: `${place.name},${place.formatted_address?.split(",")[1]}`,
          ...place.geometry?.location?.toJSON(),
        });
        setLocationValue(
          `${place.name},${place.formatted_address?.split(",")[1]}`
        );
      });
    }
  }, []);

  const onChangePricing = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isNaN(+e.target.value)) {
      const input = { ...pricing, [e.target.name]: +e.target.value };
      setPricing({
        ...input,
      });
      onChange?.(e.target.name, +e.target.value);
    }
  };

  const onBlurDailyPrice = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.name === "daily_price" && !isNaN(+e.target.value)) {
      const weekly = Math.floor(+e.target.value * 0.58 * 7);
      const monthly = weekly * 3;
      const input = {
        ...pricing,
        [e.target.name]: e.target.value,
        weekly_price: weekly,
        monthly_price: monthly,
      };
      setPricing({
        ...input,
      });

      onChange?.("daily_price", +e.target.value);
      onChange?.("weekly_price", weekly);
      onChange?.("monthly_price", monthly);
    }
  };

  console.log("data ", data);

  return (
    <Form className="mt-10" labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
      <Form.Item label="Add Photos">
        <div className="grid grid-cols-4 gap-10">
          <div
            onClick={() => widgetRef?.current?.openDialog("")}
            className="border rounded-lg cursor-pointer flex justify-center items-center text-primary overflow-hidden h-[131px]"
          >
            {fileList?.[0] ? (
              <img
                src={fileList?.[0]}
                className="max-w-full object-cover"
                alt="prev0"
              />
            ) : (
              <FaCloudUploadAlt className="text-3xl" />
            )}

            <span className="hidden">
              <Widget
                value={fileList as any}
                doNotStore={false}
                onDialogClose={onDialogClose}
                imagesOnly={true}
                multiple={true}
                multipleMax={4}
                ref={widgetRef}
                publicKey={`${process.env.NEXT_PUBLIC_UPLOAD_CARE_KEY}`}
                previewStep={true}
              />
            </span>
          </div>
          <div
            onClick={() => widgetRef?.current?.openDialog("")}
            className="border rounded-lg cursor-pointer flex justify-center items-center text-primary overflow-hidden h-[131px]"
          >
            {fileList?.[1] ? (
              <img
                src={fileList?.[1]}
                className="max-w-full object-cover"
                alt="prev1"
              />
            ) : (
              <FaCloudUploadAlt className="text-3xl" />
            )}
          </div>
          <div
            onClick={() => widgetRef?.current?.openDialog("")}
            className="border rounded-lg cursor-pointer flex justify-center items-center text-primary overflow-hidden h-[131px]"
          >
            {fileList?.[2] ? (
              <img
                src={fileList?.[2]}
                className="max-w-full object-cover"
                alt="prev2"
              />
            ) : (
              <FaCloudUploadAlt className="text-3xl" />
            )}
          </div>
          <div
            onClick={() => widgetRef?.current?.openDialog("")}
            className="border rounded-lg cursor-pointer flex justify-center items-center text-primary overflow-hidden h-[131px]"
          >
            {fileList?.[3] ? (
              <img
                src={fileList?.[3]}
                className="max-w-full object-cover"
                alt="prev3"
              />
            ) : (
              <FaCloudUploadAlt className="text-3xl" />
            )}
          </div>
        </div>
        {isInvalid && data.images?.length <= 0 ? (
          <div className="text-red-500">minimum one image is required</div>
        ) : null}
      </Form.Item>
      <Form.Item label="Listing Title">
        <Input
          placeholder="Enter"
          value={data.title}
          onChange={(e) => onChange?.("title", e.target.value)}
        />
        {isInvalid && data.title?.length <= 0 ? (
          <div className="text-red-500">listing title is required</div>
        ) : null}
      </Form.Item>
      {/* <Form.Item
        label="Category"
        className=""
      > */}
      {/* <Input placeholder="Enter" /> */}
      <div className="mb-5">
        <AutoComplete
          placeholder="Select Category..."
          dropdownMatchSelectWidth={425}
          options={categories.map((category) => ({
            label: category.name,
            value: category.id,
          }))}
          value={getValue(data.categoryId)}
          onSelect={(value: number) => {
            onChange?.("categoryId", value);
          }}
          // onSearch={onSearch}
          className="min-w-max w-full h-full text-xl custom-auto-complete"
        />
        {isInvalid && !data.categoryId ? (
          <div className="text-red-500">please choose a category</div>
        ) : null}
      </div>

      {/* </Form.Item> */}
      <Form.Item label="Description">
        <Input.TextArea
          placeholder="Enter"
          value={data.description}
          onChange={(e) => onChange?.("description", e.target.value)}
          style={{ minHeight: "96px" }}
        />
      </Form.Item>
      <Row gutter={65}>
        <Col span={12}>
          <Form.Item label="Location">
            {/* <Input placeholder="Enter" ref={locationRef} /> */}
            <input
              className="ant-input"
              ref={locationRef}
              value={locationValue}
              onChange={(e) => setLocationValue(e.target.value)}
            />
            {isInvalid && !data.location ? (
              <div className="text-red-500">invalid location</div>
            ) : null}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Item Value">
            <Input
              placeholder="Enter"
              value={data.price}
              onChange={(e) => onChange?.("price", e.target.value)}
            />
            {isInvalid && !data.price ? (
              <div className="text-red-500">please provide item value</div>
            ) : null}
          </Form.Item>
        </Col>
      </Row>
      <h2 className="font-lota text-2xl font-semibold text-primary mt-12 mb-8">
        Rent Price Per:
      </h2>
      <Row gutter={65}>
        <Col span={8}>
          <Form.Item label="Day">
            <Input
              name="daily_price"
              placeholder="Enter"
              value={pricing.daily_price}
              onChange={onChangePricing}
              onBlur={onBlurDailyPrice}
            />
            {isInvalid && !data.daily_price ? (
              <div className="text-red-500">daily price is required</div>
            ) : null}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Weeks">
            <Input
              name="weekly_price"
              placeholder="Enter"
              value={pricing.weekly_price}
              onChange={onChangePricing}
            />
            {isInvalid && !data.weekly_price ? (
              <div className="text-red-500">
                weekly price is required {data.weekly_price}
              </div>
            ) : null}
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item label="Months">
            <Input
              name="monthly_price"
              placeholder="Enter"
              value={pricing.monthly_price}
              onChange={onChangePricing}
            />
            {isInvalid && !data.monthly_price ? (
              <div className="text-red-500">monthly price is required</div>
            ) : null}
          </Form.Item>
        </Col>
      </Row>
      {/* {pricing.daily_price ? (
        (pricing.daily_price as number) * 7 < +pricing.weekly_price ? (
          <div className="text-red-500 mb-4">
            Weekly price cannot be higher than daily per day
          </div>
        ) : (pricing.daily_price as number) * 7 * 3 < +pricing.monthly_price ? (
          <div className="text-red-500 mb-4">
            Monthly price cannot be higher than weekly per day
          </div>
        ) : null
      ) : null} */}
      <Row gutter={65}>
        <Col span={12}>
          <Form.Item label="Quantity">
            <Input
              placeholder="Enter"
              value={data.quantity}
              onChange={(e) => onChange?.("quantity", e.target.value)}
            />
            {isInvalid && !data.quantity ? (
              <div className="text-red-500">quantity is required</div>
            ) : null}
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="Minimum Rental Days">
            <Input
              placeholder="Enter"
              value={data.min_rental_days}
              onChange={(e) => onChange?.("min_rental_days", e.target.value)}
            />
            {isInvalid && !data.min_rental_days ? (
              <div className="text-red-500">
                minimum rental days is required
              </div>
            ) : null}
          </Form.Item>
        </Col>
      </Row>
      <h3 className="font-lota text-lg mt-12">Availability Exceptions</h3>
      <div className="w-full flex justify-center items-center my-5">
        <div className="p-4 rounded-xl shadow">
          <DatePicker
            onChange={(date) => onChange?.("availability_exceptions", date)}
            selected={data.availability_exceptions}
          />
        </div>
      </div>
      <Form.Item>
        <Checkbox
          name="is_always_available"
          className="checkbox-label ml-40"
          checked={data.is_always_available}
          onChange={(e) => onChange?.("is_always_available", e.target.checked)}
        >
          Always Available
        </Checkbox>
      </Form.Item>
      <div className="mt-6 flex justify-end gap-5">
        <button className="w-[193px] font-sofia-pro bg-[#FAFAFA] border border-[#DFDFE6] rounded-md text-[#263238] h-12 items-center text-lg font-semibold">
          Cancel
        </button>
        <button
          onClick={onSubmit}
          className="w-[193px] font-sofia-pro bg-secondary rounded-md text-white h-12 items-center text-lg font-semibold"
        >
          Next
        </button>
      </div>
    </Form>
  );
};

export default GeneralInfo;
