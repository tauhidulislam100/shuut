import { useMutation } from "@apollo/client";
import { Switch } from "antd";
import React, { useRef } from "react";
import useAsyncEffect from "use-async-effect";
import { UPDATE_SETTING } from "../../graphql/query_mutations";
import { useAuth } from "../../hooks/useAuth";

const Settings = () => {
  const ref = useRef<boolean>(false);
  const { user, updateUser } = useAuth();
  const [updateSetting, { error }] = useMutation(UPDATE_SETTING);

  useAsyncEffect(
    async (isMounted) => {
      if (user && isMounted() && ref.current) {
        ref.current = false;
        await updateSetting({
          variables: {
            userId: user.id,
            showRating: user.showRating,
            allowNotification: user.allowNotification,
            paused: user.paused,
          },
        });
      }
    },
    [user]
  );

  return (
    <div className="my-[60px]">
      <h1 className="font-lota text-2xl font-semibold text-primary">
        Settings
      </h1>
      <div className="">
        {error ? (
          <div className="p-3 rounded-md bg-red-300 text-red-500 inline-flex mx-auto items-center justify-center my-2">
            {error.message}
          </div>
        ) : null}
        <div className="mt-[60px] flex justify-between items-center pb-6 border-b">
          <div className="font-lota text-sm sm:text-lg md:text-xl">
            <h2 className="text-inherit font-semibold">Show Ratings</h2>
            <p className="text-[#77838F]">
              show my ratings and reviews from previous engagement
            </p>
          </div>
          <div className="">
            <Switch
              className="setting-switch"
              checked={user?.showRating}
              onChange={(v) => {
                ref.current = true;
                updateUser?.({ showRating: v });
              }}
            />
          </div>
        </div>

        <div className="mt-[60px] flex justify-between items-center pb-6 border-b">
          <div className="font-lota text-sm sm:text-lg md:text-xl">
            <h2 className="text-inherit font-semibold">Allow Notifications</h2>
            <p className="text-[#77838F]">
              Turn On/Off notifications to attend to request Immediately
            </p>
          </div>
          <div className="">
            <Switch
              className="setting-switch"
              checked={user?.allowNotification}
              onChange={(v) => {
                ref.current = true;
                updateUser?.({ allowNotification: v });
              }}
            />
          </div>
        </div>

        <div className="mt-[60px] flex justify-between items-center pb-6 border-b">
          <div className="font-lota text-sm sm:text-lg md:text-xl">
            <h2 className="text-inherit font-semibold">Pause My Account</h2>
            <p className="text-[#77838F]">
              Going on Holiday? Not to worry, you can pick up right where you
              stopped.
            </p>
          </div>
          <div className="">
            <Switch
              className="setting-switch"
              checked={user?.paused}
              onChange={(v) => {
                ref.current = true;
                updateUser?.({ paused: v });
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
