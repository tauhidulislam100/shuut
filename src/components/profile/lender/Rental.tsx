import React, { useMemo, useState } from "react";
import { gql, useLazyQuery, useMutation } from "@apollo/client";
import useAsyncEffect from "use-async-effect";
import Lottie from "lottie-react";
import { useAuth } from "../../../hooks/useAuth";
import SingleProduct from "../../products/SingleProduct";
import loadingAnimation from "../../lottie/loading.json";
import { useRouter } from "next/router";
import { GET_USER_LISTINGS } from "../../../graphql/query_mutations";

const Rental = () => {
  const router = useRouter();
  const [getUserListings, { loading, data }] = useLazyQuery(GET_USER_LISTINGS);

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted() && router?.query?.user_id) {
        await getUserListings({
          variables: {
            userId: router?.query?.user_id,
          },
        });
      }
    },
    [router]
  );

  return (
    <>
      <div className="">
        {loading ? (
          <div className="grid place-items-center w-full">
            <Lottie
              animationData={loadingAnimation}
              loop={true}
              style={{ height: 350 }}
            />
          </div>
        ) : (
          <div className="grid 2xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1  gap-4">
            {data?.listing?.map((listing: Record<string, any>) => (
              <SingleProduct key={listing.id} data={listing as any} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Rental;
