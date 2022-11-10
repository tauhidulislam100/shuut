import { ApolloError, gql, useLazyQuery, useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import useAsyncEffect from "use-async-effect";
import cookie from "js-cookie";
import { notification } from "antd";
import { useRouter } from "next/router";
import { GET_ME_QUERY } from "../graphql/query_mutations";

interface IProps {
  children: React.ReactNode;
}

export type StateType = {
  SERVICE_CHARGE: number;
  SERVICE_VAT: number;
};

const initalState: StateType = {
  SERVICE_CHARGE: 0,
  SERVICE_VAT: 0,
};

export const GlobalContext = React.createContext(initalState);

const GlobalStateProvider = ({ children }: IProps) => {
  const [services, setServices] = useState({
    SERVICE_CHARGE: 0,
    SERVICE_VAT: 0,
  });

  useEffect(() => {
    setServices({
      SERVICE_CHARGE: Number(process.env.NEXT_PUBLIC_SERVICE_CHARGE),
      SERVICE_VAT: Number(process.env.NEXT_PUBLIC_SERVICE_VAT),
    });
  }, []);

  return (
    <GlobalContext.Provider value={{ ...services }}>
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalStateProvider;
