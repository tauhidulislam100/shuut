import { Collapse } from "antd";
import React from "react";
import { BiSearch, BiSearchAlt } from "react-icons/bi";
import { BsX, BsPlus } from "react-icons/bs";
import { Footer, NavBar } from "../components";

const { Panel } = Collapse;

const Faq = () => {
  return (
    <>
      <div className="bg-[#F9F9F9]">
        <NavBar />
        <div className="max-w-[811px] mx-auto text-center py-24">
          <h1 className="md:text-[64px] text-5xl font-lota font-semibold">
            Frequently Asked Questions
          </h1>
          <p className="text-xl font-lota font-normal text-[#7C8087] max-w-[551px] mx-auto text-center mt-4">
            Find below answers to some commonly asked questions about the SHUUT
            service.
          </p>
        </div>
      </div>
      <div className="container">
        <div className="max-w-[920px] mx-auto">
          <div className="relative w-full -top-12">
            <span className="absolute left-4 top-8 text-2xl text-secondary">
              <BiSearch />
            </span>
            <input
              className="w-full h-[90px] shadow-sm rounded-md px-12 border border-[#E2E4E8] text-xl text-[#7C8087] focus:outline-none"
              placeholder="What are you looking for?"
            />
          </div>
          <div className="max-w-[880px]">
            <Collapse
              className="faq-info-collapse !font-lota !font-semibold !text-sm xs:text-base sm:text-2xl"
              bordered={false}
              expandIconPosition="end"
              expandIcon={(p) =>
                p.isActive ? (
                  <span>
                    <BsX />
                  </span>
                ) : (
                  <span>
                    <BsPlus />
                  </span>
                )
              }
            >
              <Panel
                key={"1"}
                header="Is it important to complete the KYC requirement?"
              >
                <p className="text-base font-normal border-t pt-5">
                  YES. The KYC flow helps us confirm the authenticity of your
                  identity. It gives other users the confidence to borrow items
                  and list items on our platform. The security of your items is
                  a top priority for us at Shuut. Please note that the KYC
                  requirement is a one-time action.
                </p>
              </Panel>
              <Panel
                key={"2"}
                header="How do I cancel a transaction and get a refund?"
              >
                <p className="text-base font-normal border-t pt-5">
                  To cancel a transaction, you can simply go to the display page
                  of an item you have borrowed and cancel. Cancellation should
                  be done before 48 hours prior to the start date of the lease
                  to get a full refund. Where cancellation occurs within 48
                  hours prior to the start date, you are entitled to only 50%
                  refund of your deposit.
                </p>
              </Panel>
              <Panel key={"3"} header="When and how do I get my earnings?">
                <p className="text-base font-normal border-t pt-5">
                  While listing your item, you will be given the opportunity to
                  drop your bank details where your earnings will be deposited
                  24 hours after a transaction has been completed.
                </p>
              </Panel>
              <Panel
                key={"4"}
                header="Do I get a discount for renting for a longer period?"
              >
                <p className="text-base font-normal border-t pt-5">
                  When you choose to make a weekly, monthly or yearly rent, you
                  get a 13% discount for the total price.
                </p>
              </Panel>
              <Panel
                key={"5"}
                header="Can I extend the period I borrowed an item for?"
              >
                <p className="text-base font-normal border-t pt-5">
                  When you choose to make a weekly, monthly or yearly rent, you
                  get a 13% discount for the total price.
                </p>
              </Panel>
              <Panel
                key={"6"}
                header="Borrower is yet to return my item. What should I do?"
              >
                <p className="text-base font-normal border-t pt-5">
                  Where you have successfully requested or borrowed an item from
                  the owner, you can extend the period you wish to remain in
                  possession of the item by using the ‘Extend’ feature on the
                  item’s display page. This will allow you to choose the period
                  of extension and the owner is notified to either grant or
                  refuse the extension.
                </p>
              </Panel>
              <Panel
                key={"7"}
                header="What do I do if my item is damaged or lost by the borrower?"
              >
                <p className="text-base font-normal border-t pt-5">
                  Ensure to take a picture of your item before delivering it.
                  Where the item is not returned in good condition, kindly try
                  to reach an amicable agreement for repairs with the borrower.
                  If the borrower fails to cooperate, please visit SHUUT support
                  or Contact Us and we will indemnify the damage or loss.
                </p>
              </Panel>
              <Panel
                key={"8"}
                header="What kind of things can I list or borrow on Shuut?"
              >
                <p className="text-base font-normal border-t pt-5">
                  All kinds of durable and useful items can be listed and
                  borrowed on Shuut. Use our filter feature to find the items
                  you desire faster.
                </p>
              </Panel>
              <Panel key={"9"} header="How do I partner with Shuut?">
                <p className="text-base font-normal border-t pt-5">
                  For partnership and sponsorships, kindly send an email to us
                  via
                </p>
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Faq;
