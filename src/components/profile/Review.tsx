import { useLazyQuery, useMutation } from "@apollo/client";
import { Avatar, notification, Progress, Rate, Grid } from "antd";
import { Input } from "antd";
import { format } from "date-fns";
import { groupBy } from "lodash";
import { useRouter } from "next/router";
import React, { useState } from "react";
import useAsyncEffect from "use-async-effect";
import { CREATE_REVIEW, GET_USER_REVIEWS } from "../../graphql/query_mutations";
import { useAuth } from "../../hooks/useAuth";
import Button from "../UI/Button";

const { useBreakpoint } = Grid;

const { TextArea } = Input;

const ReviewDetails = ({
  parcent,
  total,
  rating,
}: {
  parcent: number;
  total: number;
  rating: number;
}) => {
  return (
    <div className="flex items-center justify-end">
      <Progress
        percent={parcent}
        strokeColor={"#2DA771"}
        strokeWidth={10}
        showInfo={false}
        className="pt-1"
      />
      <div className="w-full pl-5">
        <Rate value={rating} disabled className="text-lg" />
      </div>
      <div className="pt-2 text-[#77838F] text-base font-normal">{total}</div>
    </div>
  );
};

const ratingKeys = {
  5: undefined,
  4: undefined,
  3: undefined,
  2: undefined,
  1: undefined,
};

const Review = () => {
  const screen = useBreakpoint();
  const router = useRouter();
  const { user } = useAuth();
  const [error, setError] = useState<string>();
  const [ratingGroup, setRatingGroup] = useState<Record<string, any>>({});
  const [reviews, setReviews] = useState<Record<string, any>[]>([]);
  const [reviewForm, setReviewForm] = useState({
    content: "",
    rating: 0,
  });
  const [replyTo, setReplyTo] = useState<Record<string, any>>();

  const [getUserReviews, { data, refetch }] = useLazyQuery(GET_USER_REVIEWS, {
    onError(error) {
      notification.error({
        message: error.message,
      });
    },
    onCompleted(data) {
      if (data && data.reviews) {
        setReviews(data.reviews);
        setRatingGroup({
          ...ratingKeys,
          ...groupBy(data.reviews, (review) => Math.round(review.rating)),
        });
      }
    },
  });
  const [createReview, { loading: creatingReview }] = useMutation(
    CREATE_REVIEW,
    {
      onCompleted() {
        refetch({
          variables: {
            userId: router?.query?.user_id ?? user?.id,
          },
        });
        setReviewForm({ content: "", rating: 0 });
        setReplyTo(undefined);
      },
      onError(error) {
        notification.error({
          message: error.message,
        });
      },
    }
  );

  useAsyncEffect(
    async (isMounted) => {
      if (isMounted()) {
        if (
          router.pathname === "/profile/[user_id]" &&
          router?.query?.user_id
        ) {
          await getUserReviews({
            variables: {
              userId: router?.query?.user_id,
            },
          });
        } else if (user) {
          await getUserReviews({
            variables: {
              userId: user.id,
            },
          });
        }
      }
    },
    [router, user]
  );

  const onCreateReview = async () => {
    if (!reviewForm.content || !reviewForm.rating) {
      setError("rating and comment is required");
      return;
    }
    setError(undefined);
    if (replyTo) {
      await createReview({
        variables: {
          parentId: replyTo?.id,
          borrowerId: replyTo?.borrower_id,
          lenderId: user?.id,
          ...reviewForm,
        },
      });
    } else {
      await createReview({
        variables: {
          lenderId: router.query?.user_id,
          borrowerId: user?.id,
          ...reviewForm,
        },
      });
    }
  };

  return (
    <div className="mt-[60px]">
      <h1 className="font-lota text-2xl font-semibold">Review</h1>
      <div className="mt-[60px] w-full md:flex justify-between items-center gap-10">
        <div className="w-[270px] h-[240px] border border-[#E7E7EC] shadow-md flex justify-center items-center">
          <div className="text-center">
            <h1 className="font-jost font-medium text-[60px]">
              {data?.reviews_avg?.aggregate?.avg?.rating ?? 0}
            </h1>
            <h5 className="text-lg font-jost font-medium">Average Ratings</h5>
            <Rate
              className="text-sm"
              value={data?.reviews_avg?.aggregate?.avg?.rating ?? 0}
              allowHalf={true}
              disabled
            />
          </div>
        </div>
        <div className="md:w-2/5 mt-10">
          {Object?.keys(ratingGroup)
            .reverse()
            .map((key) => (
              <ReviewDetails
                key={key}
                rating={+key}
                total={ratingGroup?.[key]?.length ?? 0}
                parcent={
                  reviews?.length
                    ? Math.round(
                        (ratingGroup?.[key]?.length / reviews?.length) * 100
                      )
                    : 0
                }
              />
            ))}
        </div>
      </div>
      <div className="mt-[60px]">
        {reviews?.map((review: Record<string, any>) => (
          <div className="flex mb-6" key={review?.id}>
            <div className="pr-5">
              <Avatar
                size={screen.xs ? 40 : 80}
                src={
                  review?.parent_id
                    ? review.lender.profile_photo
                    : review.borrower.profile_photo
                }
              />
            </div>
            <div className="text-[#77838F] w-full">
              <div className="flex justify-between items-start w-full">
                <div className="">
                  <h2 className="xs:text-lg text-sm font-semibold text-primary">
                    {review?.parent_id
                      ? review.lender.firstName
                      : review.borrower.firstName}{" "}
                    {review?.parent_id
                      ? review.lender.lastName
                      : review.borrower.lastName}
                  </h2>
                  <p className="">
                    {format(new Date(review.created_at), "MMMM yyyy")}
                  </p>
                </div>
                <div className="">
                  <Rate
                    allowHalf={true}
                    disabled
                    value={review?.rating ?? 0}
                    count={5}
                    className="text-sm"
                  />
                </div>
              </div>
              <p className="mt-2 text-[#77838F] text-base font-lota">
                {review?.content}
              </p>
              {review.lender_id === user?.id &&
              !review?.replies?.length &&
              !review.parent_id ? (
                <div
                  className="flex justify-end"
                  onClick={() => setReplyTo(review)}
                >
                  <button className="inline-block text-[#286EE6] font-semibold text-base">
                    Reply
                  </button>
                </div>
              ) : null}
              {review?.replies?.map((reply: Record<string, any>) => (
                <div className="flex mt-4" key={reply?.id}>
                  <div className="xs:pr-5 pr-3">
                    <Avatar size={35} src={review.lender.profile_photo} />
                  </div>
                  <div className="text-[#77838F] w-full">
                    <div className="flex justify-between items-start w-full">
                      <div className="">
                        <h2 className="sm:text-lg text-sm font-semibold text-primary">
                          {review.lender.firstName} {review.lender.lastName}
                        </h2>
                        <p className="">
                          {format(new Date(reply.created_at), "MMMM yyyy")}
                        </p>
                      </div>
                      <div className="">
                        <Rate
                          allowHalf={true}
                          disabled
                          count={5}
                          value={reply?.rating ?? 0}
                          className="text-sm"
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-[#77838F] text-base font-lota">
                      {reply?.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {(user &&
        !reviews?.find((r) => r.borrower.id === user?.id) &&
        router.pathname === "/profile/[user_id]") ||
      replyTo ? (
        <div className="mt-10">
          <div className="border shadow-lg p-14 rounded-md">
            {error ? (
              <h4 className="text-red-500 text-center font-medium text-base">
                {error}
              </h4>
            ) : null}
            <div className="font-lota">
              <h1 className="text-lg font-semibold text-primary">
                {user?.firstName} {user?.lastName}
              </h1>
              {/* <p className="text-[#77838F] mt-4">Euro Production</p> */}

              <Rate
                className="text-sm"
                allowHalf
                onChange={(v) => setReviewForm((p) => ({ ...p, rating: v }))}
              />

              <h2 className="text-primary mt-3 mb-2">Comment</h2>
              <TextArea
                rows={8}
                placeholder="Enter"
                className="px-6 py-5 text-sm font-jost"
                value={reviewForm.content}
                onChange={(e) =>
                  setReviewForm((p) => ({ ...p, content: e.target.value }))
                }
              />
            </div>
          </div>
          <div className="mt-10 flex justify-end">
            <Button
              onClick={onCreateReview}
              loading={creatingReview}
              className="font-sofia-pro px-7 bg-secondary hover:bg-primary hover:shadow-md rounded-md text-white h-12 inline-flex items-center text-lg font-semibold"
            >
              Leave Feedback
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Review;
