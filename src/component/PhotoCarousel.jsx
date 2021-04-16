import React from 'react'
import { Carousel, Empty } from 'antd'
import { CarouselPrevIcon, CarouselNextIcon } from '../view/icon/Icon'

export const PhotoCarousel = (props) => {
  return props.picList.length > 0 ? (
    <Carousel
      adaptiveHeight={true}
      arrows={true}
      dots={false}
      prevArrow={<CarouselPrevIcon />}
      nextArrow={<CarouselNextIcon />}
    >
      {props.picList.map((photo, index) => (
        <div key={index}>
          <div className='product-real-pic-carousel-item'>
            <img src={photo} alt='商品照片' />
          </div>
        </div>
      ))}
    </Carousel>
  ) : (
    <Empty />
  )
}
