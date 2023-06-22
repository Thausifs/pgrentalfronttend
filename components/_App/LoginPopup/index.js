import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import OtpInput from "./otpinput";

function LoginPopup({ open, hidePopup }) {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog onClose={hidePopup} className="relative z-[9999]">
        <div className="bg-black/30 fixed inset-0" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95">
            <Dialog.Panel className="mx-auto max-w-[36rem] w-full relative rounded-2xl bg-white">
              <div
                className="h-[36px] w-[36px] rounded-full flex items-center cursor-pointer absolute -top-[17px] -right-[11px] justify-center bg-white shadow"
                onClick={hidePopup}>
                <FiX size={22} className="stroke-black" />
              </div>
              <div className="p-[32px]">
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Enter Phone number"
                    className="h-[45px] rounded-[8px] border outline-0 border-[#D0D5DD] placeholder:text-[#D0D5DD] shadow-sm pllaceholder:font-normal px-3 flex items-center w-full mb-4"
                  />
                  <button className="bg-green rounded-lg font-medium text-white text-[12px] px-3 py-1 border shadow-lg gap-3 text-center absolute right-1 top-1 bottom-1">Send OTP</button>
                </div>
                <div className="text-center">
                  <div className="block mx-auto text-left">
                    <label className="font-Lato inline-block mb-1 text-sm font-medium">
                      Enter Otp
                    </label>
                    <div className="hidden sm:block sm:[&_input]:!w-[72px] sm:[&_input]:!h-[72px] [&_input]:!w-[50px] [&_input]:!h-[50px]">
                      <OtpInput />
                    </div>
                    <div className=" w-full">
                      <input
                        type="email"
                        placeholder="Enter Your PIN"
                        className="h-[45px] font-Lato placeholder:font-normal sm:hidden rounded-[8px] border outline-0 border-[#D0D5DD] placeholder:text-[#D0D5DD] shadow-sm px-3 flex items-center w-full mb-4"
                      />
                    </div>
                    <div className="flex items-center justify-between mx-auto my-4 text-left">
                      <label className="font-Lato inline-block mb-1 text-sm font-medium">
                        Recent Otp
                      </label>
                      <h3>123532</h3>
                    </div>
                  </div>
                </div>
                <button className="bg-green rounded-lg text-white px-6 py-3.5 border shadow-lg flex items-center gap-3 w-full text-center justify-center mt-6">Login</button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}

export default LoginPopup;
