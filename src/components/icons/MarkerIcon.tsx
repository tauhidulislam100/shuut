import * as React from "react";

const MarkerIcon = ({ color = "#fff", ...props }) => (
  <svg
    width={50}
    height={37}
    fill="none"
    viewBox="0 0 50 37"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#a)">
      <mask id="b" fill={color}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.742.093C2.78.093 2 .873 2 1.833V24.26c0 .962.78 1.741 1.74 1.741h16.335l5.862 5.311 5.861-5.31H46.26c.962 0 1.741-.78 1.741-1.742V1.834c0-.962-.78-1.741-1.74-1.741H3.74Z"
        />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M3.742.093C2.78.093 2 .873 2 1.833V24.26c0 .962.78 1.741 1.74 1.741h16.335l5.862 5.311 5.861-5.31H46.26c.962 0 1.741-.78 1.741-1.742V1.834c0-.962-.78-1.741-1.74-1.741H3.74Z"
        fill={color}
      />
      <path
        d="m20.076 26 .584-.645-.248-.225h-.336V26Zm5.862 5.311-.585.645.585.53.584-.53-.584-.645Zm5.861-5.31v-.871h-.335l-.25.225.585.645ZM2.871 1.833c0-.48.39-.87.87-.87V-.778a2.611 2.611 0 0 0-2.61 2.61h1.74Zm0 22.425V1.834h-1.74v22.425h1.74Zm.87.87a.87.87 0 0 1-.87-.87h-1.74a2.611 2.611 0 0 0 2.61 2.611v-1.74Zm16.335 0H3.742v1.741h16.334v-1.74Zm6.446 5.537-5.862-5.311-1.169 1.29 5.862 5.311 1.169-1.29Zm4.693-5.311-5.862 5.311 1.169 1.29 5.862-5.31-1.17-1.291Zm15.045-.225H31.8v1.74h14.46v-1.74Zm.87-.87c0 .48-.39.87-.87.87v1.74a2.611 2.611 0 0 0 2.611-2.61h-1.74Zm0-22.426v22.425h1.741V1.834h-1.74Zm-.87-.87c.48 0 .87.39.87.87h1.741a2.611 2.611 0 0 0-2.61-2.611v1.74Zm-42.518 0H46.26V-.778H3.742v1.74Z"
        fill="#D3D3D3"
        mask="url(#b)"
      />
    </g>
    <defs>
      <filter
        id="a"
        x={0.001}
        y={0.093}
        width={50}
        height={36.218}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy={3} />
        <feGaussianBlur stdDeviation={1} />
        <feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
        <feBlend
          in2="BackgroundImageFix"
          result="effect1_dropShadow_2649_6790"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_dropShadow_2649_6790"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default MarkerIcon;
