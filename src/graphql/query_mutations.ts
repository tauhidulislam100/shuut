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

export const GET_ME_QUERY = gql`
  query {
    currentUser: GetMe {
      user {
        id
        firstName
        lastName
        email
        isActive
        emailVerified
        phoneVerified
        allowNotification
        showRating
        paused
        verified
        bank_account {
          bank_id
          account_number
        }
      }
    }
  }
`;
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

export const RESET_PASSWORD_MUTATION = gql`
  mutation ($email: String!) {
    reset: ResetPassword(email: $email) {
      status
    }
  }
`;

export const SET_NEW_PASSWORD_MUTATION = gql`
  mutation ($resetToken: String!, $password: String!) {
    reset: SetNewPassword(resetToken: $resetToken, password: $password) {
      status
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
    $distance_in_meters: Float!
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
      icon
      description
    }
  }
`;

export const GetCategoryWithImages = gql`
  query {
    category(
      where: { _and: [{ order: { _gt: 0 } }, { order: { _lte: 8 } }] }
      order_by: { order: asc }
    ) {
      id
      slug
      name
      image
      description
      order
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
  mutation InsertNewListing(
    $title: String!
    $location: Location!
    $images: [String!]!
    $accept_insurance: Boolean!
    $accept_terms: Boolean!
    $delivery_option: String
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
    $availability_exceptions: [Exception]
    $address_id: bigint!
    $bank_id: bigint!
    $account_number: String!
  ) {
    listing: CreateListing(
      title: $title
      description: $description
      location: $location
      images: $images
      accept_insurance: $accept_insurance
      accept_terms: $accept_terms
      delivery_option: $delivery_option
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
      address_id: $address_id
    ) {
      id
      slug
    }
    bank_account: insert_user_bank_accounts(
      objects: {
        bank_id: $bank_id
        account_number: $account_number
        user_id: $user_id
      }
      on_conflict: {
        constraint: user_bank_accounts_user_id_key
        update_columns: [account_number, bank_id]
      }
    ) {
      affected_rows
    }
  }
`;

export const GetListingDetailsBySlug = gql`
  query ListingDetailBySlug($slug: String!, $currentDate: date) {
    listing(where: { slug: { _eq: $slug } }, limit: 1) {
      id
      title
      description
      daily_price
      weekly_price
      monthly_price
      location_name
      quantity
      lat
      lng
      images {
        url
        id
      }
      availability_exceptions
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
        reviews_info: customer_reviews_aggregate(
          where: { parent_id: { _is_null: true } }
        ) {
          aggregate {
            count
            avg {
              rating
            }
          }
        }
        customer_reviews(limit: 2, where: { parent_id: { _is_null: true } }) {
          id
          borrower {
            id
            firstName
            lastName
            profile_photo
          }
          rating
          content
          created_at
        }
      }
      bookings(
        where: {
          _or: [
            { end: { _gte: $currentDate } }
            { start: { _gte: $currentDate } }
          ]
          _and: {
            _or: [{ state: { _eq: "PENDING" } }, { state: { _eq: "ACCEPTED" } }]
          }
        }
      ) {
        quantity
        start
        end
      }
    }
  }
`;

export const GetListingBySlug = gql`
  query ListingBySlug($slug: String!) {
    listing(where: { slug: { _eq: $slug } }, limit: 1) {
      id
      title
      description
      daily_price
      weekly_price
      monthly_price
      location_name
      quantity
      lat
      lng
      images {
        url
        id
      }
      category {
        id
        name
        image
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
    $start: date!
    $end: date!
    $quantity: Int
    $listing_id: bigint!
  ) {
    result: CheckAvailability(
      start: $start
      end: $end
      quantity: $quantity
      listing_id: $listing_id
    ) {
      available
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation (
    $listing_id: bigint!
    $quantity: Int
    $start: date!
    $end: date!
    $pricing_option: String!
  ) {
    AddToCart(
      listing_id: $listing_id
      quantity: $quantity
      start: $start
      end: $end
      pricing_option: $pricing_option
    ) {
      id
    }
  }
`;

export const GET_CART_ITEMS = gql`
  query GetCartItems($userId: bigint!) {
    cartItems: booking(
      where: {
        user_id: { _eq: $userId }
        _and: { transaction_id: { _is_null: true } }
      }
    ) {
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
`;

export const GET_USER_LISTINGS = gql`
  query GetUserListings($userId: bigint!) {
    listing(where: { user_id: { _eq: $userId } }) {
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
`;

export const GET_LENDER_DETAILS = gql`
  query GetLenderDetails($userId: Int!) {
    user: user_by_pk(id: $userId) {
      id
      firstName
      lastName
      email
      phone
      profile_photo
      profile {
        id
        business_name
        store_location
        description
        opening_hours
        closing_hours
        cover_photo
      }
      addresses(where: { is_default: { _eq: true } }) {
        delivery_address
      }
    }
  }
`;

export const GET_USER_REVIEWS = gql`
  query GetUserReviews($userId: bigint!) {
    reviews(
      where: {
        deleted: { _eq: false }
        lender_id: { _eq: $userId }
        parent_id: { _is_null: true }
      }
      distinct_on: borrower_id
    ) {
      id
      content
      rating
      created_at
      parent_id
      lender_id
      borrower_id
      borrower {
        id
        firstName
        lastName
        profile_photo
      }
      lender {
        id
        firstName
        lastName
        profile_photo
      }
      replies {
        id
        content
        rating
        created_at
      }
    }
    reviews_avg: reviews_aggregate(
      where: {
        deleted: { _eq: false }
        lender_id: { _eq: $userId }
        parent_id: { _is_null: true }
      }
      distinct_on: borrower_id
    ) {
      aggregate {
        avg {
          rating
        }
      }
    }
  }
`;

export const CREATE_REVIEW = gql`
  mutation CreateReview(
    $lenderId: bigint
    $borrowerId: bigint
    $rating: numeric!
    $content: String!
    $parentId: bigint
  ) {
    review: insert_reviews_one(
      object: {
        rating: $rating
        content: $content
        lender_id: $lenderId
        borrower_id: $borrowerId
        parent_id: $parentId
      }
      on_conflict: { constraint: reviews_borrower_id_lender_id_parent_id_key }
    ) {
      id
      content
      rating
      created_at
      borrower {
        id
        firstName
        lastName
        profile_photo
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
  query ($bookings: [bigint!]!) {
    summary: GetTransactionSummary(bookings: $bookings) {
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
          bookingId
          title
          images
        }
        user {
          id
          firstName
          lastName
          reviews {
            rating
            total
          }
        }
      }
    }
  }
`;

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction(
    $payinTotal: numeric!
    $userId: bigint!
    $address: String!
  ) {
    transaction: insert_transaction_one(
      object: {
        address: $address
        payinTotal: $payinTotal
        customer: $userId
        ordered: true
        payoutTotal: 0
      }
    ) {
      id
    }
  }
`;

export const CONFIRM_TRANSACTION = gql`
  mutation (
    $transaction_id: bigint!
    $amount: numeric!
    $status: String!
    $reference: String!
    $bookings: [bigint!]!
  ) {
    update_booking(
      where: { id: { _in: $bookings } }
      _set: { state: "PENDING", transaction_id: $transaction_id }
    ) {
      affected_rows
    }

    result: insert_payment_one(
      object: {
        amount: $amount
        status: $status
        reference: $reference
        transaction_id: $transaction_id
        comment: "payment for full transaction"
      }
    ) {
      id
    }
  }
`;

export const UPSERT_PROFILE = gql`
  mutation UpsertProfile(
    $userId: Int!
    $cover_photo: String
    $description: String
    $advance: numeric
    $business_name: String
    $opening_hours: String
    $closing_hours: String
    $store_location: String
    $firstName: String
    $lastName: String
    $phone: String!
    $profile_photo: String
  ) {
    insert_profiles_one(
      object: {
        user_id: $userId
        description: $description
        advance: $advance
        business_name: $business_name
        cover_photo: $cover_photo
        opening_hours: $opening_hours
        closing_hours: $closing_hours
        store_location: $store_location
      }
      on_conflict: {
        constraint: profiles_user_id_key
        update_columns: [
          description
          advance
          business_name
          closing_hours
          cover_photo
          opening_hours
          store_location
        ]
      }
    ) {
      id
    }

    update_user(
      where: { id: { _eq: $userId } }
      _set: {
        firstName: $firstName
        lastName: $lastName
        phone: $phone
        profile_photo: $profile_photo
      }
    ) {
      affected_rows
    }
  }
`;

export const GET_USER_INFO_BY_ID = gql`
  query GetUserInfoById($id: Int!) {
    userInfo: user_by_pk(id: $id) {
      firstName
      lastName
      phone
      profile_photo
      profile {
        description
        advance
        business_name
        closing_hours
        opening_hours
        store_location
        cover_photo
      }
      addresses {
        id
        first_name
        last_name
        is_default
        city
        state
        delivery_address
        country
        phone
      }
    }
  }
`;

export const UPDATE_SETTING = gql`
  mutation UPDATE_SETTING(
    $userId: Int!
    $allowNotification: Boolean
    $showRating: Boolean
    $paused: Boolean
  ) {
    update_user(
      where: { id: { _eq: $userId } }
      _set: {
        allowNotification: $allowNotification
        showRating: $showRating
        paused: $paused
      }
    ) {
      affected_rows
    }
  }
`;

export const GET_MY_ADDRESSES = gql`
  query GetMyAddresses($userId: Int!) {
    address(where: { user_id: { _eq: $userId } }) {
      id
      user_id
      first_name
      last_name
      phone
      city
      state
      delivery_address
      is_default
      country
    }
  }
`;

export const CREATE_ADDRESS = gql`
  mutation createAddress(
    $first_name: String
    $last_name: String
    $city: String!
    $state: String!
    $phone: jsonb
    $delivery_address: String!
    $is_default: Boolean!
    $country: String
    $user_id: Int!
  ) {
    insert_address_one(
      object: {
        first_name: $first_name
        last_name: $last_name
        city: $city
        state: $state
        phone: $phone
        delivery_address: $delivery_address
        is_default: $is_default
        user_id: $user_id
      }
    ) {
      id
    }
  }
`;

export const UPDTAE_ADDRESS = gql`
  mutation updateAddress(
    $first_name: String
    $last_name: String
    $city: String!
    $state: String!
    $phone: jsonb
    $delivery_address: String!
    $is_default: Boolean
    $country: String
    $id: bigint!
  ) {
    update_address(
      where: { id: { _eq: $id } }
      _set: {
        first_name: $first_name
        last_name: $last_name
        city: $city
        state: $state
        phone: $phone
        delivery_address: $delivery_address
        country: $country
        is_default: $is_default
      }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: Int!) {
    delete_address(where: { id: { _eq: $id } }) {
      affected_rows
    }
  }
`;

export const GET_MY_INBOXES = gql`
  query MyInbox($userId: bigint!, $offset: Int!, $limit: Int!) {
    inbox_aggregate(
      where: { _or: [{ from: { _eq: $userId } }, { to: { _eq: $userId } }] }
    ) {
      aggregate {
        total: count
      }
    }

    inbox(
      where: { _or: [{ from: { _eq: $userId } }, { to: { _eq: $userId } }] }
      order_by: [
        { created_at: desc }
        { messages_aggregate: { variance: { id: asc } } }
      ]
      offset: $offset
      limit: $limit
    ) {
      id
      created_at
      from: user {
        id
        firstName
        lastName
        profile_photo
      }
      to: userByTo {
        id
        firstName
        lastName
        profile_photo
      }
      messages(order_by: { created_at: desc }, limit: 10) {
        id
        inbox_id
        content
        created_at
        receiver_has_read
        # month
        sender: user {
          id
          firstName
          lastName
          profile_photo
        }
      }
    }
  }
`;

export const MY_INBOXES_SUBSCRIPTION_STREAM = gql`
  subscription MyInboxStream($userId: bigint!, $createdAt: timestamptz) {
    inbox_stream(
      batch_size: 10
      cursor: { initial_value: { created_at: $createdAt } }
      where: { _or: [{ from: { _eq: $userId } }, { to: { _eq: $userId } }] }
    ) {
      id
      created_at
      from: user {
        id
        firstName
        lastName
        profile_photo
      }
      to: userByTo {
        id
        firstName
        lastName
        profile_photo
      }
      messages(order_by: { created_at: desc }, limit: 1) {
        id
        inbox_id
        content
        created_at
        receiver_has_read
        # month
        sender: user {
          id
          firstName
          lastName
          profile_photo
        }
      }
    }
  }
`;

export const MY_MESSAGES = gql`
  query MyMessages($limit: Int!, $offset: Int!, $inbox_id: bigint!) {
    my_messages: messages(
      where: { inbox_id: { _eq: $inbox_id } }
      order_by: { created_at: desc }
      limit: $limit
      offset: $offset
    ) {
      id
      inbox_id
      content
      created_at
      receiver_has_read
      sender: user {
        id
        firstName
        lastName
        profile_photo
      }
    }

    my_messages_info: messages_aggregate(
      where: { inbox_id: { _eq: $inbox_id } }
    ) {
      aggregate {
        total: count
      }
    }
  }
`;

export const MY_MESSAGES_SUBSCRIPTION = gql`
  subscription MyMessagesStream($userId: bigint!) {
    messages(
      where: {
        inbox: { _or: [{ from: { _eq: $userId } }, { to: { _eq: $userId } }] }
      }
      order_by: { created_at: desc }
      limit: 10
    ) {
      id
      inbox_id
      content
      created_at
      receiver_has_read
      # month
      sender: user {
        id
        firstName
        lastName
        profile_photo
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation SendMessage($sender: bigint!, $inboxId: bigint!, $message: String!) {
    insert_messages_one(
      object: { sender: $sender, inbox_id: $inboxId, content: $message }
    ) {
      id
    }
  }
`;

export const CREATE_INBOX = gql`
  mutation CreateInbox($from: bigint!, $to: bigint!) {
    inbox: insert_inbox_one(object: { from: $from, to: $to }) {
      id
      from: user {
        id
        firstName
        lastName
        profile_photo
      }
      to: userByTo {
        id
        firstName
        lastName
        profile_photo
      }
      messages(order_by: { created_at: asc }) {
        id
        inbox_id
        content
        created_at
        receiver_has_read
        sender: user {
          id
          firstName
          lastName
          profile_photo
        }
      }
    }
  }
`;

export const DELETE_INBOXES = gql`
  mutation DeleteInboxes($inboxes: [bigint!]!) {
    delete_inbox(where: { id: { _in: $inboxes } }) {
      affected_rows
    }
  }
`;

export const MARK_MESSAGE_AS_READ = gql`
  mutation MarkMessageAsRead($inboxId: bigint!, $userId: bigint!) {
    update_messages(
      where: {
        inbox_id: { _eq: $inboxId }
        _and: [
          { sender: { _neq: $userId } }
          { receiver_has_read: { _eq: false } }
        ]
      }
      _set: { receiver_has_read: true }
    ) {
      affected_rows
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($email: String!, $password: String!) {
    DeleteAccount(password: $password, email: $email) {
      status
      message
    }
  }
`;

export const UPDATE_FAVORITE = gql`
  mutation AddFavorites(
    $userId: bigint!
    $listingId: bigint!
    $isFavorite: Boolean
  ) {
    favorite: insert_favorite_one(
      object: {
        user_id: $userId
        listing_id: $listingId
        is_favorite: $isFavorite
      }
      on_conflict: {
        constraint: favorite_listing_id_user_id_key
        update_columns: [is_favorite]
      }
    ) {
      id
      is_favorite
      listing_id
    }
  }
`;

export const GET_FAVORITES = gql`
  query GetFavorites($userId: bigint!) {
    favorite(
      where: { user_id: { _eq: $userId }, _and: { is_favorite: { _eq: true } } }
    ) {
      user_id
      is_favorite
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
`;

export const VERIFY_USER_KYC = gql`
  mutation KycVerificationUser(
    $documentType: String
    $verificationType: String!
    $countryCode: String!
    $searchParameter: String!
    $firstName: String
    $lastName: String
    $dob: String
    $gender: String
    $selfie: String
    $selfieToDatabaseMatch: Boolean
  ) {
    KycVerification(
      documentType: $documentType
      verificationType: $verificationType
      countryCode: $countryCode
      searchParameter: $searchParameter
      firstName: $firstName
      lastName: $lastName
      dob: $dob
      gender: $gender
      selfie: $selfie
      selfieToDatabaseMatch: $selfieToDatabaseMatch
    ) {
      status
      message
    }
  }
`;
export const EXTEND_REQUEST = gql`
  mutation ($extend_to: date!, $extend_from: date!, $booking_id: bigint!) {
    update_booking(
      where: { id: { _eq: $booking_id } }
      _set: {
        state: "EXTEND"
        extend_from: $extend_from
        extend_to: $extend_to
      }
    ) {
      affected_rows
    }
  }
`;

export const EXTENSION_PAYMENT = gql`
  mutation (
    $vat: numeric!
    $service_charge: numeric!
    $cost: numeric!
    $booking_id: bigint!
    $amount: numeric!
    $status: String!
    $reference: String!
    $transaction_id: bigint!
  ) {
    update_booking(
      where: { id: { _eq: $booking_id } }
      _set: {
        is_extension_paid: true
        vat: $vat
        cost: $cost
        service_charge: $service_charge
      }
    ) {
      affected_rows
    }
    result: insert_payment_one(
      object: {
        amount: $amount
        status: $status
        reference: $reference
        transaction_id: $transaction_id
        booking_id: $booking_id
        comment: "booking extension payment"
      }
    ) {
      id
    }
  }
`;

export const GET_ALL_BANKS = gql`
  query GetAllBanks {
    banks {
      id
      name
    }
  }
`;

export const CANCEL_BOOKING = gql`
  mutation CancelBooking($booking_id: bigint) {
    update_booking(
      where: { id: { _eq: $booking_id } }
      _set: { state: "CANCELLED" }
    ) {
      affected_rows
    }
  }
`;

export const CHANGE_BOOKING_DATE = gql`
  mutation ChangeBookingDate(
    $id: bigint!
    $startDate: date!
    $endDate: date!
    $cost: numeric!
    $vat: numeric!
    $serviceCharge: numeric!
    $transaction_id: bigint
    $amount: numeric
    $status: String
    $reference: String
    $executePayment: Boolean!
  ) {
    changeDate: update_booking(
      where: { id: { _eq: $id } }
      _set: {
        start: $startDate
        end: $endDate
        cost: $cost
        vat: $vat
        service_charge: $serviceCharge
      }
    ) {
      affected_rows
    }
    createPayment: insert_payment_one(
      object: {
        transaction_id: $transaction_id
        booking_id: $id
        amount: $amount
        status: $status
        reference: $reference
        comment: "Payment for Changing booking date"
      }
    ) @include(if: $executePayment) {
      id
    }
  }
`;

export const CREATE_PAYMENT = gql`
  mutation CreatePayment(
    $transaction_id: bigint!
    $booking_id: bigint!
    $amount: numeric!
    $status: String!
    $reference: String!
    $comment: String
  ) {
    insert_payment_one(
      object: {
        transaction_id: $transaction_id
        booking_id: $booking_id
        amount: $amount
        status: $status
        reference: $reference
        comment: $comment
      }
    ) {
      id
    }
  }
`;

export const UPDATE_COVER_PHOTO = gql`
  mutation UpdateCoverPhoto($userId: Int!, $url: String!) {
    update_profiles(
      where: { user_id: { _eq: $userId } }
      _set: { cover_photo: $url }
    ) {
      affected_rows
    }
  }
`;

export const UPDATE_PROFILE_PHOTO = gql`
  mutation UpdateProfilePhoto($userId: Int!, $url: String!) {
    update_user(
      where: { id: { _eq: $userId } }
      _set: { profile_photo: $url }
    ) {
      affected_rows
    }
  }
`;

export const GET_MY_BOOKINGS = gql`
  query GetBookings(
    $state: [booking_bool_exp!]
    $customer: bigint!
    $start: date
  ) {
    booking(
      where: {
        _or: $state
        _and: { transaction: { customer: { _eq: $customer } } }
      }
    ) {
      id
      start
      end
      cost
      discount
      vat
      service_charge
      state
      pricing_option
      extend_to
      extend_from
      is_extension_paid
      transaction_id
      listing {
        id
        slug
        title
        daily_price
        weekly_price
        monthly_price
        location_name
        availability_exceptions
        quantity
        images {
          url
          id
        }
        user {
          firstName
          lastName
          id
          profile_photo
        }
        bookings(
          where: {
            _or: [{ start: { _gte: $start } }, { end: { _gte: $start } }]
            _and: [
              { state: { _neq: "PROPOSED" } }
              { state: { _neq: "CANCELLED" } }
              { state: { _neq: "DECLINED" } }
            ]
          }
        ) {
          start
          end
          quantity
        }
      }
    }
  }
`;

export const GET_HAND_IN_LISTINGS = gql`
  query GetBookings($state: String!, $customer: bigint!, $start: date!) {
    booking(
      where: {
        state: { _eq: $state }
        _and: {
          transaction: { customer: { _eq: $customer } }
          start: { _eq: $start }
        }
      }
    ) {
      id
      start
      end
      cost
      discount
      vat
      service_charge
      state
      pricing_option
      extend_from
      is_extension_paid
      transaction_id
      listing {
        id
        slug
        title
        daily_price
        weekly_price
        monthly_price
        location_name
        availability_exceptions
        quantity
        images {
          url
          id
        }
        user {
          firstName
          lastName
          id
          profile_photo
        }
        bookings(
          where: {
            _or: [{ start: { _gte: $start } }, { end: { _gte: $start } }]
            _and: [
              { state: { _neq: "PROPOSED" } }
              { state: { _neq: "CANCELLED" } }
              { state: { _neq: "DECLINED" } }
            ]
          }
        ) {
          start
          end
          quantity
        }
      }
    }
  }
`;
export const BOOKING_REQUEST_QUERY = gql`
  query GetBookings($userId: bigint!) {
    booking(
      where: {
        _or: [{ state: { _eq: "PENDING" } }, { state: { _eq: "EXTEND" } }]
        _and: { listing: { user_id: { _eq: $userId } } }
      }
    ) {
      id
      start
      end
      cost
      discount
      vat
      service_charge
      state
      pricing_option
      extend_to
      extend_from
      is_extension_paid
      transaction {
        id
        user {
          id
          firstName
          lastName
          profile_photo
          phone
        }
      }
      listing {
        id
        slug
        title
        daily_price
        weekly_price
        monthly_price
        location_name
        availability_exceptions
        quantity
        images {
          url
          id
        }
      }
    }
  }
`;

export const GET_MY_UNAVAILABLE_ITEMS = gql`
  query ($startdate: date!, $enddate: date!, $user_id: Int!) {
    listing: get_unavailable_listing(
      args: { startdate: $startdate, enddate: $enddate }
      where: { user_id: { _eq: $user_id } }
    ) {
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
`;

export const APPROVE_BOOKING_REQUEST = gql`
  mutation UpdateBookingState($id: bigint!, $state: String!) {
    result: update_booking_by_pk(
      pk_columns: { id: $id }
      _set: { state: $state }
    ) {
      id
      state
    }
  }
`;

export const APPROVE_EXTEND_REQUEST = gql`
  mutation UpdateBookingState($id: bigint!, $state: String!, $extendTo: date) {
    result: update_booking_by_pk(
      pk_columns: { id: $id }
      _set: { state: $state, end: $extendTo }
    ) {
      id
      state
    }
  }
`;

export const GET_MY_LISTINGS = gql`
  query GetMyListings($userId: bigint!, $start: date!) {
    listing(where: { user_id: { _eq: $userId } }) {
      id
      slug
      title
      daily_price
      location_name
      quantity
      availability_exceptions
      images {
        url
        id
      }
      user {
        firstName
        lastName
        id
      }
      bookings(
        where: {
          _or: [{ start: { _gte: $start } }, { end: { _gte: $start } }]
          _and: [
            { state: { _neq: "PROPOSED" } }
            { state: { _neq: "CANCELLED" } }
            { state: { _neq: "DECLINED" } }
          ]
        }
      ) {
        start
        end
        state
        quantity
      }
    }
  }
`;

export const CHECK_DATE_QUERY = gql`
  query GetBookings($start: date!, $end: date!, $userId: bigint!) {
    booking(
      where: {
        _and: [
          { listing: { user_id: { _eq: $userId } } }
          {
            _or: [
              { state: { _eq: "ACCEPTED" } }
              { state: { _eq: "EXTEND" } }
              { state: { _eq: "EXTENDED" } }
            ]
          }
          { _and: [{ start: { _gte: $start } }, { end: { _lte: $end } }] }
        ]
      }
    ) {
      id
      start
      end
      cost
      discount
      vat
      service_charge
      state
      pricing_option
      listing {
        id
        slug
        title
        daily_price
        weekly_price
        monthly_price
        location_name
        availability_exceptions
        quantity
        images {
          url
          id
        }
        user {
          firstName
          lastName
          id
          profile_photo
        }
      }
    }
  }
`;

export const ADD_UNAVAILABILITY = gql`
  mutation AddUnavailability($exceptions: jsonb!, $listing_id: bigint!) {
    update_listing(
      where: { id: { _eq: $listing_id } }
      _set: { availability_exceptions: $exceptions }
    ) {
      affected_rows
    }
  }
`;

export const SUBSCRIBE_NEWSLETTER = gql`
  mutation SubscribeNewsLetter($email: String!) {
    insert_newsletters(objects: { email: $email }) {
      affected_rows
    }
  }
`;
