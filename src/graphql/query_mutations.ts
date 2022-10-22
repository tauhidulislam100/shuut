import { gql } from "@apollo/client";

export const SIGNUP_MUTATION = gql`
  mutation (
    $firstName: String!
    $lastName: String!
    $email: String!
    $password: String!
    $phone: String
    $emailVerified: Boolean
    $phoneVerified: Boolean
    $isActive: Boolean
    $postalCode: String
    $social_id: String
  ) {
    result: SignUp(
      firstName: $firstName
      lastName: $lastName
      email: $email
      password: $password
      phone: $phone
      emailVerified: $emailVerified
      phoneVerified: $phoneVerified
      isActive: $isActive
      postalCode: $postalCode
      social_id: $social_id
    ) {
      id
      token
    }
  }
`;

// const SIGNUP_MUTATION = gql`
//   mutation (
//     $firstName: String!
//     $lastName: String!
//     $email: String!
//     $password: String
//     $phone: String
//     $emailVerified: Boolean
//     $phoneVerified: Boolean
//     $isActive: Boolean
//     $postalCode: String
//     $social_id: String!
//   ) {
//     user: SignUp(
//       firstName: $firstName
//       lastName: $lastName
//       email: $email
//       password: $password
//       phone: $phone
//       emailVerified: $emailVerified
//       phoneVerified: $phoneVerified
//       isActive: $isActive
//       postalCode: $postalCode
//       social_id: $social_id
//     ) {
//       token
//     }
//   }
// `;

export const VERIFICATION_MUTATION = gql`
  mutation (
    $code: String!
    $verificationType: String!
    $transactionId: String
  ) {
    result: VerifyCode(
      code: $code
      verificationType: $verificationType
      transactionId: $transactionId
    ) {
      status
    }
  }
`;

export const SEND_VERIFICATION_CODE_EMAIL = gql`
  mutation ($email: String!) {
    result: SendEmailVerificationCode(email: $email) {
      status
    }
  }
`;

export const SEND_PHONE_VERIFICATION_CDOE = gql`
  mutation ($phone: String!, $email: String!) {
    result: SendPhoneVerificationCode(email: $email, phone: $phone) {
      status
      transactionId
    }
  }
`;

export const SearchListingQuery = gql`
  query SearchQuery(
    $queryText: String
    $startdate: String
    $enddate: String
    $lat: float8
    $lng: float8
    $distance_in_meters: float8
    $sortby: String
  ) {
    listings: SearchListing(
      lat: $lat
      lng: $lng
      distance_in_meters: $distance_in_meters
      queryText: $queryText
      startdate: $startdate
      enddate: $enddate
      sortby: $sortby
    ) {
      id
      title
      slug
      location_name
      daily_price
      lat
      lng
      images {
        id
        url
      }
      category {
        id
        name
      }
      user {
        id
        firstName
        lastName
      }
    }
  }
`;

export const GetAllCategoryQuery = gql`
  query {
    category {
      id
      slug
      name
      image
      description
    }
  }
`;

export const GetAllInsuranceQuery = gql`
  query {
    insurance {
      id
      policy_name
      coverage
      description
    }
  }
`;

export const CreateListingMutation = gql`
  # input Location {
  #   lat: float8!
  #   lng: float8!
  #   name: String!
  # }
  mutation InsertNewListing(
    $title: String!
    $location: Location!
    $images: [String!]!
    $accept_insurance: Boolean!
    $accept_terms: Boolean!
    $delivery_option: String!
    $insurance_id: bigint!
    $quantity: numeric!
    $description: String!
    $plusCode: String
    $price: money!
    $daily_price: numeric!
    $weekly_price: numeric!
    $monthly_price: numeric!
    $min_rental_days: Int!
    $is_always_available: Boolean
    $user_id: bigint!
    $categoryId: bigint!
    $availability_exceptions: Exception
  ) {
    listing: CreateListing(
      title: $title
      description: $description
      location: $location
      images: $images
      accept_insurance: $accept_insurance
      accept_terms: $accept_terms
      delivery_option: $delivery_option
      insurance_id: $insurance_id
      quantity: $quantity
      plusCode: $plusCode
      price: $price
      daily_price: $daily_price
      weekly_price: $weekly_price
      monthly_price: $monthly_price
      min_rental_days: $min_rental_days
      is_always_available: $is_always_available
      user_id: $user_id
      categoryId: $categoryId
      availability_exceptions: $availability_exceptions
    ) {
      id
      slug
    }
  }
`;

export const GetListingDetailsBySlug = gql`
  query ListingDetailBySlug($slug: String!) {
    listing(where: { slug: { _eq: $slug } }, limit: 1) {
      id
      title
      description
      daily_price
      weekly_price
      monthly_price
      location_name
      lat
      lng
      images {
        url
        id
      }
      category {
        id
        name
        listings(limit: 5) {
          id
          title
          slug
          location_name
          daily_price
          images {
            id
            url
          }
          category {
            id
            name
          }
          user {
            id
            firstName
            lastName
          }
        }
      }
      user {
        id
        firstName
        lastName
        listings(limit: 5) {
          id
          title
          slug
          location_name
          daily_price
          images {
            id
            url
          }
          category {
            id
            name
          }
        }
      }
    }
  }
`;

export const GetListingByCategory = gql`
  query ($name: String!, $lat: float8, $lng: float8, $distance: Float!) {
    listing(
      where: {
        location: {
          _st_d_within: {
            distance: $distance #meters
            from: { type: "Point", coordinates: [$lng, $lat] }
          }
        }
        category: { name: { _ilike: $name } }
      }
    ) {
      id
      title
      slug
      location_name
      daily_price
      lat
      lng
      images {
        id
        url
      }
      category {
        id
        name
        image
      }
      user {
        id
        firstName
        lastName
      }
    }
  }
`;

export const CHECK_AVAILABILITY_QUERY = gql`
  query CheckAvailability(
    $startdate: date!
    $enddate: date!
    $listing_id: Int!
  ) {
    result: check_availability(
      args: {
        startdate: $startdate
        enddate: $enddate
        listing_id: $listing_id
      }
    ) {
      available
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation ($listing_id: bigint!, $quantity: Int, $start: date!, $end: date!) {
    AddToCart(
      listing_id: $listing_id
      quantity: $quantity
      start: $start
      end: $end
    ) {
      id
    }
  }
`;

export const GET_CART_ITEMS = gql`
  query GetCartItems($userId: bigint!) {
    cart: transaction(
      where: { ordered: { _eq: false }, _and: { customer: { _eq: $userId } } }
      limit: 1
    ) {
      cartItems: bookings {
        id
        quantity
        listing {
          id
          slug
          title
          daily_price
          location_name
          images {
            url
            id
          }
          user {
            firstName
            lastName
            id
          }
        }
      }
    }
  }
`;

export const DELETE_CART_ITEM = gql`
  mutation ($id: bigint!) {
    delete_booking_by_pk(id: $id) {
      id
    }
  }
`;

export const GET_TRANSACTION_SUMMARY = gql`
  query {
    summary: GetTransactionSummary {
      transactionId
      total
      serviceCharge
      vat
      items {
        listings {
          from
          to
          price
          quantity
          serviceCharge
          listingId
          transactionItemId
          title
          images
        }
        user {
          id
          firstName
          lastName
        }
      }
    }
  }
`;

export const CREATE_PAYMENT = gql`
  mutation CreatePayment(
    $amount: numeric!
    $status: String!
    $reference: String!
  ) {
    result: insert_payment_one(
      object: { amount: $amount, status: $status, reference: $reference }
    ) {
      id
    }
  }
`;

export const CONFIRM_TRANSACTION = gql`
  mutation ($id: bigint!, $paymentId: bigint!, $payinTotal: numeric) {
    update_transaction(
      where: { id: { _eq: $id } }
      _set: { ordered: true, paymentId: $paymentId, payinTotal: $payinTotal }
    ) {
      affected_rows
    }

    update_booking(
      where: { transaction_id: { _eq: $id } }
      _set: { state: "PENDING" }
    ) {
      affected_rows
    }
  }
`;