import { useLazyQuery, useSubscription } from "@apollo/client";
import React, { useEffect, useState } from "react";
import useAsyncEffect from "use-async-effect";
import { GET_MY_INBOX } from "../graphql/query_mutations";
import { useAuth } from "../hooks/useAuth";

interface IProps {
  children: React.ReactNode;
}

export interface IMessageUser {
  id: number;
  firstName: string;
  lastName: string;
  profile_photo: string;
}
export interface IMessage {
  id: number;
  inbox_id: number;
  sender: IMessageUser;
  content: string;
  receiver_has_read: boolean;
  created_at: string;
  updated_at?: string;
}

export interface InboxType {
  id: number;
  from: IMessageUser;
  to: IMessageUser;
  messages: IMessage[];
}

export type StateType = {
  SERVICE_CHARGE: number;
  SERVICE_VAT: number;
  inboxes: InboxType[];
};

const initalState: StateType = {
  SERVICE_CHARGE: 0,
  SERVICE_VAT: 0,
  inboxes: [],
};

const SERVICE_CHARGE = Number(process.env.NEXT_PUBLIC_SERVICE_CHARGE);
const SERVICE_VAT = Number(process.env.NEXT_PUBLIC_SERVICE_VAT);

export const GlobalContext = React.createContext(initalState);

const GlobalStateProvider = ({ children }: IProps) => {
  const { user } = useAuth();
  const { data: myInboxes } = useSubscription(GET_MY_INBOX, {
    variables: {
      userId: user?.id,
    },
  });

  return (
    <GlobalContext.Provider
      value={{ SERVICE_CHARGE, SERVICE_VAT, inboxes: myInboxes?.inbox }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalStateProvider;
