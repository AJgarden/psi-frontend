import React from 'react'
import Icon from '@ant-design/icons'

const SaleDeliverySvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z' />
  </svg>
)
export const SaleDeliveryIcon = (props) => <Icon component={SaleDeliverySvg} {...props} />

const ProductSelectSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' />
  </svg>
)
export const ProductSelectIcon = (props) => <Icon component={ProductSelectSvg} {...props} />
const ProductNextSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z' />
  </svg>
)
export const ProductNextIcon = (props) => <Icon component={ProductNextSvg} {...props} />
const ProductExpandSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M24 24H0V0h24v24z' fill='none' opacity='.87' />
    <path d='M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6-1.41-1.41z' />
  </svg>
)
export const ProductExpandIcon = (props) => <Icon component={ProductExpandSvg} {...props} />

const CarouselNextSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z' />
  </svg>
)
export const CarouselNextIcon = (props) => <Icon component={CarouselNextSvg} {...props} />
const CarouselPrevSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z' />
  </svg>
)
export const CarouselPrevIcon = (props) => <Icon component={CarouselPrevSvg} {...props} />
const PhotoUploadSvg = () => (
  <svg
    enableBackground='new 0 0 24 24'
    height='36px'
    viewBox='0 0 24 24'
    width='36px'
    fill='#000000'
  >
    <g>
      <rect fill='none' height='24' width='24' />
    </g>
    <g>
      <path d='M18,15v3H6v-3H4v3c0,1.1,0.9,2,2,2h12c1.1,0,2-0.9,2-2v-3H18z M7,9l1.41,1.41L11,7.83V16h2V7.83l2.59,2.58L17,9l-5-5L7,9z' />
    </g>
  </svg>
)
export const PhotoUploadIcon = (props) => <Icon component={PhotoUploadSvg} {...props} />
const PhotoViewSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z' />
  </svg>
)
export const PhotoViewIcon = (props) => <Icon component={PhotoViewSvg} {...props} />

const ListFeedbackSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.17l-.59.59-.58.58V4h16v12zm-9-4h2v2h-2zm0-6h2v4h-2z' />
  </svg>
)
export const ListFeedbackIcon = (props) => <Icon component={ListFeedbackSvg} {...props} />
const ListFlagSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z' />
  </svg>
)
export const ListFlagIcon = (props) => <Icon component={ListFlagSvg} {...props} />
const ListBlockSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9C4.63 15.55 4 13.85 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1C19.37 8.45 20 10.15 20 12c0 4.42-3.58 8-8 8z' />
  </svg>
)
export const ListBlockIcon = (props) => <Icon component={ListBlockSvg} {...props} />
const ListTickSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z' />
  </svg>
)
export const ListTickIcon = (props) => <Icon component={ListTickSvg} {...props} />
const ListOpenSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z' />
  </svg>
)
export const ListOpenIcon = (props) => <Icon component={ListOpenSvg} {...props} />
const ListImageSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z' />
  </svg>
)
export const ListImageIcon = (props) => <Icon component={ListImageSvg} {...props} />
const ListPrintSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M19 8h-1V3H6v5H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zM8 5h8v3H8V5zm8 12v2H8v-4h8v2zm2-2v-2H6v2H4v-4c0-.55.45-1 1-1h14c.55 0 1 .45 1 1v4h-2z' />
    <circle cx='18' cy='11.5' r='1' />
  </svg>
)
export const ListPrintIcon = (props) => <Icon component={ListPrintSvg} {...props} />
const ListDeleteSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z' />
  </svg>
)
export const ListDeleteIcon = (props) => <Icon component={ListDeleteSvg} {...props} />
const ListEditSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M14.06 9.02l.92.92L5.92 19H5v-.92l9.06-9.06M17.66 3c-.25 0-.51.1-.7.29l-1.83 1.83 3.75 3.75 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.2-.2-.45-.29-.71-.29zm-3.6 3.19L3 17.25V21h3.75L17.81 9.94l-3.75-3.75z' />
  </svg>
)
export const ListEditIcon = (props) => <Icon component={ListEditSvg} {...props} />
const ListSearchSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z' />
  </svg>
)
export const ListSearchIcon = (props) => <Icon component={ListSearchSvg} {...props} />
const ListAddSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
  </svg>
)
export const ListAddIcon = (props) => <Icon component={ListAddSvg} {...props} />

const HeaderNotifyExistSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zM7.58 4.08L6.15 2.65C3.75 4.48 2.17 7.3 2.03 10.5h2c.15-2.65 1.51-4.97 3.55-6.42zm12.39 6.42h2c-.15-3.2-1.73-6.02-4.12-7.85l-1.42 1.43c2.02 1.45 3.39 3.77 3.54 6.42z' />
  </svg>
)
export const HeaderNotifyExistIcon = (props) => <Icon component={HeaderNotifyExistSvg} {...props} />
const HeaderNotifyEmptySvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2zm-2 1H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6z' />
  </svg>
)
export const HeaderNotifyEmptyIcon = (props) => <Icon component={HeaderNotifyEmptySvg} {...props} />
const HeaderLogoutSvg = () => (
  <svg
    enableBackground='new 0 0 24 24'
    height='36px'
    viewBox='0 0 24 24'
    width='36px'
    fill='#ffffff'
  >
    <g>
      <path d='M0,0h24v24H0V0z' fill='none' />
    </g>
    <g>
      <path d='M17,8l-1.41,1.41L17.17,11H9v2h8.17l-1.58,1.58L17,16l4-4L17,8z M5,5h7V3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h7v-2H5V5z' />
    </g>
  </svg>
)
export const HeaderLogoutIcon = (props) => <Icon component={HeaderLogoutSvg} {...props} />
const HeaderAccountSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM7.07 18.28c.43-.9 3.05-1.78 4.93-1.78s4.51.88 4.93 1.78C15.57 19.36 13.86 20 12 20s-3.57-.64-4.93-1.72zm11.29-1.45c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6zm0 5c-.83 0-1.5-.67-1.5-1.5S11.17 8 12 8s1.5.67 1.5 1.5S12.83 11 12 11z' />
  </svg>
)
export const HeaderAccountIcon = (props) => <Icon component={HeaderAccountSvg} {...props} />

const SiderMenuReceiveSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z' />
  </svg>
)
export const SiderMenuReceiveIcon = (props) => <Icon component={SiderMenuReceiveSvg} {...props} />
const SiderMenuSaleSvg = () => (
  <svg
    enableBackground='new 0 0 20 20'
    height='36px'
    viewBox='0 0 20 20'
    width='36px'
    fill='#000000'
  >
    <g>
      <rect fill='none' height='20' width='20' />
      <path d='M14,3H6C5.45,3,5,3.45,5,4v1c0,0.55,0.45,1,1,1h8c0.55,0,1-0.45,1-1V4C15,3.45,14.55,3,14,3z M14,5H6V4h8V5z M16,17H4 c-0.55,0-1-0.45-1-1l0,0l0-1h14v1l0,0C17,16.55,16.55,17,16,17z M14.26,7.61C14.1,7.24,13.74,7,13.34,7H6.66 C6.26,7,5.9,7.24,5.74,7.61L3,14h14L14.26,7.61z M7.75,13h-0.5c-0.28,0-0.5-0.22-0.5-0.5c0-0.28,0.22-0.5,0.5-0.5h0.5 c0.28,0,0.5,0.22,0.5,0.5C8.25,12.78,8.03,13,7.75,13z M7.75,11h-0.5c-0.28,0-0.5-0.22-0.5-0.5S6.97,10,7.25,10h0.5 c0.28,0,0.5,0.22,0.5,0.5S8.03,11,7.75,11z M7.75,9h-0.5c-0.28,0-0.5-0.22-0.5-0.5c0-0.28,0.22-0.5,0.5-0.5h0.5 c0.28,0,0.5,0.22,0.5,0.5C8.25,8.78,8.03,9,7.75,9z M10.25,13h-0.5c-0.28,0-0.5-0.22-0.5-0.5S9.47,12,9.75,12h0.5 c0.28,0,0.5,0.22,0.5,0.5S10.53,13,10.25,13z M10.25,11h-0.5c-0.28,0-0.5-0.22-0.5-0.5c0-0.28,0.22-0.5,0.5-0.5h0.5 c0.28,0,0.5,0.22,0.5,0.5C10.75,10.78,10.53,11,10.25,11z M10.25,9h-0.5c-0.28,0-0.5-0.22-0.5-0.5S9.47,8,9.75,8h0.5 c0.28,0,0.5,0.22,0.5,0.5S10.53,9,10.25,9z M12.75,13h-0.5c-0.28,0-0.5-0.22-0.5-0.5s0.22-0.5,0.5-0.5h0.5c0.28,0,0.5,0.22,0.5,0.5 S13.03,13,12.75,13z M12.75,11h-0.5c-0.28,0-0.5-0.22-0.5-0.5c0-0.28,0.22-0.5,0.5-0.5h0.5c0.28,0,0.5,0.22,0.5,0.5 C13.25,10.78,13.03,11,12.75,11z M12.75,9h-0.5c-0.28,0-0.5-0.22-0.5-0.5S11.97,8,12.25,8h0.5c0.28,0,0.5,0.22,0.5,0.5 S13.03,9,12.75,9z' />
    </g>
  </svg>
)
export const SiderMenuSaleIcon = (props) => <Icon component={SiderMenuSaleSvg} {...props} />
const SiderMenuPurchaseSvg = () => (
  <svg
    enableBackground='new 0 0 24 24'
    height='36px'
    viewBox='0 0 24 24'
    width='36px'
    fill='#000000'
  >
    <g>
      <rect fill='none' height='24' width='24' />
    </g>
    <g>
      <g>
        <path d='M5,5h2v3h10V5h2v5h2V5c0-1.1-0.9-2-2-2h-4.18C14.4,1.84,13.3,1,12,1S9.6,1.84,9.18,3H5C3.9,3,3,3.9,3,5v14 c0,1.1,0.9,2,2,2h6v-2H5V5z M12,3c0.55,0,1,0.45,1,1s-0.45,1-1,1s-1-0.45-1-1S11.45,3,12,3z' />
        <polygon points='21,11.5 15.51,17 12.5,14 11,15.5 15.51,20 22.5,13' />
      </g>
    </g>
  </svg>
)
export const SiderMenuPurchaseIcon = (props) => <Icon component={SiderMenuPurchaseSvg} {...props} />
const SiderMenuProductSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M12 2l-5.5 9h11L12 2zm0 3.84L13.93 9h-3.87L12 5.84zM17.5 13c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm0 7c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5zM3 21.5h8v-8H3v8zm2-6h4v4H5v-4z' />
  </svg>
)
export const SiderMenuProductIcon = (props) => <Icon component={SiderMenuProductSvg} {...props} />
const SiderMenuWidgetSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M16.66 4.52l2.83 2.83-2.83 2.83-2.83-2.83 2.83-2.83M9 5v4H5V5h4m10 10v4h-4v-4h4M9 15v4H5v-4h4m7.66-13.31L11 7.34 16.66 13l5.66-5.66-5.66-5.65zM11 3H3v8h8V3zm10 10h-8v8h8v-8zm-10 0H3v8h8v-8z' />
  </svg>
)
export const SiderMenuWidgetIcon = (props) => <Icon component={SiderMenuWidgetSvg} {...props} />
const SiderMenuBasicSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M9 13.75c-2.34 0-7 1.17-7 3.5V19h14v-1.75c0-2.33-4.66-3.5-7-3.5zM4.34 17c.84-.58 2.87-1.25 4.66-1.25s3.82.67 4.66 1.25H4.34zM9 12c1.93 0 3.5-1.57 3.5-3.5S10.93 5 9 5 5.5 6.57 5.5 8.5 7.07 12 9 12zm0-5c.83 0 1.5.67 1.5 1.5S9.83 10 9 10s-1.5-.67-1.5-1.5S8.17 7 9 7zm7.04 6.81c1.16.84 1.96 1.96 1.96 3.44V19h4v-1.75c0-2.02-3.5-3.17-5.96-3.44zM15 12c1.93 0 3.5-1.57 3.5-3.5S16.93 5 15 5c-.54 0-1.04.13-1.5.35.63.89 1 1.98 1 3.15s-.37 2.26-1 3.15c.46.22.96.35 1.5.35z' />
  </svg>
)
export const SiderMenuBasicIcon = (props) => <Icon component={SiderMenuBasicSvg} {...props} />
const SiderMenuDashboardSvg = () => (
  <svg
    enableBackground='new 0 0 24 24'
    height='36px'
    viewBox='0 0 24 24'
    width='36px'
    fill='#000000'
  >
    <g>
      <rect fill='none' height='24' width='24' />
      <g>
        <path d='M19,3H5C3.9,3,3,3.9,3,5v14c0,1.1,0.9,2,2,2h14c1.1,0,2-0.9,2-2V5C21,3.9,20.1,3,19,3z M19,19H5V5h14V19z' />
        <rect height='5' width='2' x='7' y='12' />
        <rect height='10' width='2' x='15' y='7' />
        <rect height='3' width='2' x='11' y='14' />
        <rect height='2' width='2' x='11' y='10' />
      </g>
    </g>
  </svg>
)
export const SiderMenuDashboardIcon = (props) => (
  <Icon component={SiderMenuDashboardSvg} {...props} />
)
const SiderMenuHomeSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z' />
  </svg>
)
export const SiderMenuHomeIcon = (props) => <Icon component={SiderMenuHomeSvg} {...props} />

const SiderSwitchSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#ffffff'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z' />
  </svg>
)
export const SiderSwitchIcon = (props) => <Icon component={SiderSwitchSvg} {...props} />

const LoginPasswordOffSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0zm0 0h24v24H0z' fill='none' />
    <path d='M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z' />
  </svg>
)
export const LoginPasswordOffIcon = (props) => <Icon component={LoginPasswordOffSvg} {...props} />
const LoginPasswordOnSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z' />
  </svg>
)
export const LoginPasswordOnIcon = (props) => <Icon component={LoginPasswordOnSvg} {...props} />
const LoginPasswordSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z' />
  </svg>
)
export const LoginPasswordIcon = (props) => <Icon component={LoginPasswordSvg} {...props} />
const LoginAccountSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0z' fill='none' />
    <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
  </svg>
)
export const LoginAccountIcon = (props) => <Icon component={LoginAccountSvg} {...props} />

const UtilCloseSvg = () => (
  <svg height='36px' viewBox='0 0 24 24' width='36px' fill='#000000'>
    <path d='M0 0h24v24H0V0z' fill='none' />
    <path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z' />
  </svg>
)
export const UtilCloseIcon = (props) => <Icon component={UtilCloseSvg} {...props} />
