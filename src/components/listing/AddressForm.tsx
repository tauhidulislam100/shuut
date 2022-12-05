import { useMutation, useQuery } from "@apollo/client";
import { notification, Radio, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { BiPencil } from "react-icons/bi";
import { FaTimes } from "react-icons/fa";
import {
  CREATE_ADDRESS,
  DELETE_ADDRESS,
  GET_MY_ADDRESSES,
  UPDTAE_ADDRESS,
} from "../../graphql/query_mutations";
import { useAuth } from "../../hooks/useAuth";
import Button from "../UI/Button";
import Modal from "../UI/Modal";

export const FormInput = ({ invalid, ...props }: any) => {
  return (
    <input
      {...props}
      className={`w-full bg-white border rounded-[5px] h-12 px-4 placeholder:text-[#677489] text-primary font-lota ${
        invalid ? "border-red-500" : "border-[#E3E8EF]"
      }`}
    />
  );
};

interface IProps {
  onChange?: (value: any) => void;
  selectedAddress?: Record<string, any>;
  selectedAddressId?: number;
  buttonText?: string;
}

const AddressForm = ({
  onChange,
  selectedAddress,
  selectedAddressId,
  buttonText,
}: IProps) => {
  const { user } = useAuth();
  const [defaultAddress, setDefaultAddress] = useState<Record<string, any>>();
  const { data: myAddress, refetch } = useQuery(GET_MY_ADDRESSES, {
    variables: {
      userId: user?.id,
    },
  });
  const [createAddress, { loading }] = useMutation(CREATE_ADDRESS, {
    onCompleted() {
      refetch({
        userId: user?.id,
      });
      setShowNewAddressForm(false);
      setCreateAddressForm({
        first_name: "",
        last_name: "",
        delivery_address: "",
        city: "",
        state: "",
        phone: [""],
      });
      setIsEditMode(true);
    },
    onError(error) {
      notification.error({
        message: error?.message,
      });
    },
  });
  const [updateAddress, { loading: updateLoading }] = useMutation(
    UPDTAE_ADDRESS,
    {
      onCompleted() {
        refetch({
          userId: user?.id,
        });
        setShowNewAddressForm(false);
        setCreateAddressForm({
          first_name: "",
          last_name: "",
          delivery_address: "",
          city: "",
          state: "",
          phone: [""],
        });
        setIsEditMode(true);
      },
      onError(error) {
        notification.error({
          message: error?.message,
        });
      },
    }
  );
  const [deleteAddress, { loading: deleteLoading }] = useMutation(
    DELETE_ADDRESS,
    {
      onCompleted() {
        notification.success({
          message: "address deleted",
        });
        refetch({
          userId: user?.id,
        });
      },
      onError(error) {
        notification.error({
          message: error.message,
        });
      },
    }
  );

  const [addressInvalid, setAddressInvalid] = useState(false);
  const [visibleAddressModal, setVisibleAddressModal] = useState(false);
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [addressForm, setAddressForm] = useState({
    first_name: defaultAddress?.first_name ?? user?.firstName,
    last_name: defaultAddress?.last_name ?? user?.lastName,
    delivery_address: defaultAddress?.delivery_address ?? "",
    city: defaultAddress?.city ?? "",
    state: defaultAddress?.state,
    phone: defaultAddress?.phone?.[0] ?? user?.phone ?? "",
    user_id: user?.id,
  });
  const [createAddressForm, setCreateAddressForm] = useState({
    first_name: "",
    last_name: "",
    delivery_address: "",
    city: "",
    state: "",
    phone: [""],
  });

  useEffect(() => {
    const addr =
      myAddress?.address?.find((item: any) => item?.is_default) ??
      myAddress?.address?.[0];
    setDefaultAddress({ ...addr });
  }, [myAddress]);

  useEffect(() => {
    if (
      defaultAddress &&
      !Object.keys(selectedAddress ?? {}).length &&
      !selectedAddressId
    ) {
      setAddressForm({
        first_name: defaultAddress?.first_name ?? user?.firstName,
        last_name: defaultAddress?.last_name ?? user?.lastName,
        delivery_address: defaultAddress?.delivery_address ?? "",
        city: defaultAddress?.city ?? "",
        state: defaultAddress?.state,
        phone: defaultAddress?.phone?.[0] ?? user?.phone ?? "",
        user_id: user?.id,
      });
      onChange?.(defaultAddress);
    }
    if (
      selectedAddress &&
      JSON.stringify(defaultAddress) !== JSON.stringify(selectedAddress) &&
      Object.keys(selectedAddress).length
    ) {
      setDefaultAddress({ ...selectedAddress });
    }

    if (
      selectedAddressId &&
      !selectedAddress &&
      defaultAddress?.id !== selectedAddressId
    ) {
      setDefaultAddress({
        ...myAddress?.address?.find(
          (item: any) => item?.id === selectedAddressId
        ),
      });
    }
  }, [
    defaultAddress,
    user,
    onChange,
    selectedAddress,
    selectedAddressId,
    myAddress,
  ]);

  const handleAddressFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setAddressForm((p) => {
      const { value, name } = e.target;
      return { ...p, [name]: value };
    });
  };

  const onCreateAddressFormChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    setCreateAddressForm((p) => {
      const { value, name } = e.target;
      return { ...p, [name]: value };
    });
  };

  const onAddAddress = async () => {
    if (
      !addressForm.delivery_address ||
      !addressForm.city ||
      !addressForm.state ||
      !addressForm.city ||
      !addressForm.phone
    ) {
      setAddressInvalid(true);
      return;
    }
    setAddressInvalid(false);
    if (defaultAddress) {
      const { id, ...rest } = defaultAddress;
      await updateAddress({
        variables: {
          ...rest,
          ...addressForm,
          phone: [
            ...Array.from(
              new Set([addressForm.phone, ...defaultAddress.phone])
            ),
          ],
          id: id,
          is_default: true,
        },
      });
    } else {
      await createAddress({
        variables: {
          ...addressForm,
          phone: [addressForm.phone],
          is_default: true,
        },
      });
    }
  };

  const createNewAddress = async () => {
    if (
      !createAddressForm.delivery_address ||
      !createAddressForm.city ||
      !createAddressForm.state ||
      !createAddressForm.city ||
      !createAddressForm.phone
    ) {
      setAddressInvalid(true);
      return;
    }
    if (isEditMode) {
      await updateAddress({
        variables: {
          ...createAddressForm,
        },
      });
    } else {
      await createAddress({
        variables: {
          ...createAddressForm,
          user_id: user?.id,
          is_default: false,
        },
      });
    }
  };

  const onDeleteAddrees = async (id: number) => {
    await deleteAddress({
      variables: {
        id,
      },
    });
  };

  return (
    <>
      <div className="border border-[#DFDFE6] rounded-[10px] bg-[#FCFCFD] p-6">
        {defaultAddress ? (
          <div className="flex flex-col items-end justify-center">
            <div className="bg-white rounded-lg p-4 font-lota font-normal border border-[#E3E8EF] w-full mb-3">
              <h4 className="text-xl font-semibold text-primary font-lota mb-2">
                {defaultAddress?.first_name} {defaultAddress?.last_name}
              </h4>
              <p>
                {defaultAddress?.delivery_address}, {defaultAddress?.city}{" "}
                {defaultAddress?.state}
              </p>
              <p>{defaultAddress?.phone?.join(",")}</p>
            </div>
            <button
              onClick={() => setVisibleAddressModal(true)}
              className="ml-auto text-[#0094FF] text-base font-lota"
            >
              Change Delivery Address
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="mb-4 w-[30%]">
                <label
                  htmlFor="firstName"
                  className="block font-lota text-base font-normal mb-1"
                >
                  First Name
                </label>
                <FormInput
                  onChange={handleAddressFormChange}
                  value={addressForm?.first_name}
                  placeholder="first name."
                  name="first_name"
                />
              </div>
              <div className="mb-4 w-[30%]">
                <label
                  htmlFor="firstName"
                  className="block font-lota text-base font-normal mb-1"
                >
                  Last Name
                </label>
                <FormInput
                  onChange={handleAddressFormChange}
                  value={addressForm?.last_name}
                  placeholder="last name."
                  name="last_name"
                />
              </div>
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="Phone Number"
                className="block font-lota text-base font-normal mb-1"
              >
                Phone Number
              </label>
              <FormInput
                onChange={handleAddressFormChange}
                value={addressForm.phone}
                placeholder="Phone Number."
                name="phone"
                invalid={!addressForm.phone && addressInvalid}
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="Phone Number"
                className="block font-lota text-base font-normal mb-1"
              >
                Delivery Address
              </label>
              <textarea
                onChange={handleAddressFormChange}
                value={addressForm?.delivery_address}
                className={`w-full bg-white border rounded-[5px] p-4 placeholder:text-[#677489] text-primary font-lota ${
                  addressInvalid && !addressForm.delivery_address
                    ? "border-red-500"
                    : "border-[#E3E8EF]"
                }`}
                placeholder="Delivery Address"
                rows={3}
                name="delivery_address"
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="mb-4 w-[30%]">
                <label
                  htmlFor="firstName"
                  className="block font-lota text-base font-normal mb-1"
                >
                  State
                </label>
                <FormInput
                  onChange={handleAddressFormChange}
                  name="state"
                  value={addressForm?.state}
                  placeholder="State"
                  invalid={!addressForm.state && addressInvalid}
                />
              </div>
              <div className="mb-4 w-[30%]">
                <label
                  htmlFor="firstName"
                  className="block font-lota text-base font-normal mb-1"
                >
                  City
                </label>
                <FormInput
                  onChange={handleAddressFormChange}
                  name="city"
                  value={addressForm?.city}
                  placeholder="City"
                  invalid={!addressForm.city && addressInvalid}
                />
              </div>
            </div>
          </>
        )}
      </div>
      {!defaultAddress ? (
        <div className="flex justify-end items-center my-4">
          <Button loading={loading || updateLoading} onClick={onAddAddress}>
            {buttonText ? buttonText : "Save Address"}
          </Button>
        </div>
      ) : null}

      <Modal
        onCancel={() => setVisibleAddressModal(false)}
        visible={visibleAddressModal}
        width={750}
      >
        <div className="w-full">
          <div className="flex items-center justify-between border-b-[1.7px] border-[#E3E8EF] pb-4 mb-4">
            <h2 className="text-4xl font-semibold font-lota text-primary">
              {showNewAddressForm ? "Add Address" : "Address"}
            </h2>
          </div>
          {!showNewAddressForm ? (
            <>
              <div className="flex items-center justify-between border-b-[1.7px] border-[#E3E8EF] pb-4 mb-4">
                <button
                  onClick={() => setShowNewAddressForm(true)}
                  className="text-2xl font-normal text-secondary"
                >
                  Add New Address
                </button>
              </div>
              <div>
                {myAddress?.address?.map(
                  (adr: Record<string, any>, indx: number) => (
                    <div
                      className="flex items-stretch mb-4 border-b-[1.7px] border-[#E3E8EF] pb-4 last:border-b-0"
                      key={adr.id}
                    >
                      <Radio
                        checked={
                          adr.id === selectedAddress?.id ||
                          adr?.id === selectedAddressId
                        }
                        className="self-center"
                        name="address_id"
                        value={adr?.id}
                        onChange={(e) => {
                          if (e.target.checked) {
                            onChange?.(adr);
                          }
                        }}
                      />
                      <div key={adr?.id} className="w-full ml-5">
                        <p className="text-base text-[#677489] text-opacity-95 mb-1">
                          {adr?.is_default
                            ? "Default Address"
                            : "Saved Address"}
                        </p>

                        <h2 className="text-2xl font-normal font-lota text-primary">
                          {adr?.first_name} {adr?.last_name}
                        </h2>
                        <p className="text-base text-[#677489] my-1">
                          {adr?.delivery_address}, {adr?.city}, {adr?.state}{" "}
                          {adr?.country}
                        </p>
                        <p className="text-base text-[#677489]">
                          {adr?.phone?.join(",")}
                        </p>
                      </div>
                      <div className="flex flex-col justify-between">
                        <button
                          onClick={() => {
                            setIsEditMode(true);
                            setShowNewAddressForm(true);
                            setCreateAddressForm({ ...adr } as any);
                          }}
                          className="ml-auto flex items-center text-base text-primary-100 font-normal"
                        >
                          <BiPencil />
                          <span className="ml-2">Edit</span>
                        </button>
                        <button
                          onClick={() => onDeleteAddrees(adr.id)}
                          className="items-end justify-end text-red-500"
                        >
                          {deleteLoading ? <Spin size="small" /> : "Remove"}
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="flex items-center justify-center">
                <Button
                  onClick={() => setVisibleAddressModal(false)}
                  className="w-[60%] bg-secondary text-white h-[81px] rounded-lg  flex items-center justify-center text-2xl font-semibold font-lota"
                >
                  Use This Address
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div className="mb-4 w-[30%]">
                  <label
                    htmlFor="firstName"
                    className="block font-lota text-base font-normal mb-1"
                  >
                    First Name
                  </label>
                  <FormInput
                    onChange={onCreateAddressFormChange}
                    value={createAddressForm?.first_name}
                    placeholder="first name."
                    name="first_name"
                  />
                </div>
                <div className="mb-4 w-[30%]">
                  <label
                    htmlFor="firstName"
                    className="block font-lota text-base font-normal mb-1"
                  >
                    Last Name
                  </label>
                  <FormInput
                    onChange={onCreateAddressFormChange}
                    value={createAddressForm?.last_name}
                    placeholder="last name."
                    name="last_name"
                  />
                </div>
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="Phone Number"
                  className="block font-lota text-base font-normal mb-1"
                >
                  Phone Number
                </label>
                {createAddressForm?.phone?.map((p, index) => (
                  <div key={index} className="mb-3 relative">
                    <FormInput
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setCreateAddressForm((s) => {
                          s.phone[index] = e.target.value;
                          return { ...s };
                        });
                      }}
                      value={p}
                      placeholder="Phone Number."
                      name="phone"
                      invalid={
                        !createAddressForm?.phone?.[index] && addressInvalid
                      }
                    />
                    {index >= 1 && (
                      <button
                        onClick={() =>
                          setCreateAddressForm((s) => {
                            s.phone.splice(index, 1);
                            return { ...s, phone: [...s.phone] };
                          })
                        }
                        className="absolute top-4 right-4 text-red-500"
                      >
                        <FaTimes />
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex mt-1">
                  <button
                    className="ml-auto text-[#0094FF] text-base text-normal inline-block"
                    onClick={() =>
                      setCreateAddressForm((s) => {
                        return { ...s, phone: [...s.phone, ""] };
                      })
                    }
                  >
                    Add Phone Number
                  </button>
                </div>
              </div>
              <div className="mb-4 w-full">
                <label
                  htmlFor="Phone Number"
                  className="block font-lota text-base font-normal mb-1"
                >
                  Delivery Address
                </label>
                <textarea
                  onChange={onCreateAddressFormChange}
                  value={createAddressForm.delivery_address}
                  className={`w-full bg-white border rounded-[5px] p-4 placeholder:text-[#677489] text-primary font-lota ${
                    addressInvalid && !createAddressForm.delivery_address
                      ? "border-red-500"
                      : "border-[#E3E8EF]"
                  }`}
                  placeholder="Delivery Address"
                  rows={3}
                  name="delivery_address"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="mb-4 w-[30%]">
                  <label
                    htmlFor="firstName"
                    className="block font-lota text-base font-normal mb-1"
                  >
                    State
                  </label>
                  <FormInput
                    onChange={onCreateAddressFormChange}
                    name="state"
                    value={createAddressForm?.state}
                    placeholder="State"
                    invalid={!createAddressForm.state && addressInvalid}
                  />
                </div>
                <div className="mb-4 w-[30%]">
                  <label
                    htmlFor="firstName"
                    className="block font-lota text-base font-normal mb-1"
                  >
                    City
                  </label>
                  <FormInput
                    onChange={onCreateAddressFormChange}
                    name="city"
                    value={createAddressForm?.city}
                    placeholder="City"
                    invalid={!createAddressForm.city && addressInvalid}
                  />
                </div>
              </div>
              <div className="flex items-center justify-center mt-8">
                <Button
                  onClick={createNewAddress}
                  loading={loading || updateLoading}
                  className="w-[60%] bg-secondary text-white h-[81px] rounded-lg  flex items-center justify-center text-2xl font-semibold font-lota"
                >
                  Save
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </>
  );
};

export default AddressForm;
