'use client'
import React from 'react'
import style from './TypeCards.module.css'
import Link from 'next/link'

const TypeCards = ({paragraph,url,heading}) => {
    return (
        <div className={style.card}>
            <div className={style.cardInner}>
                <div className={`${style.cardFront} bg-[url('/assets/icons-bg.jpg')] bg-no-repeat bg-center bg-cover relative overflow-hidden`}>
                    <div className='absolute inset-0 bg-black/90'>
                        <div className='p-3 text-white xl:text-lg text-lg lg:text-base'>
                            <p>{paragraph}</p>
                        </div>
                        <div className='absolute bottom-3 right-3'>
                            <h3 className='text-white xl:text-2xl lg:text-xl text-2xl uppercase'>{heading}</h3>
                        </div>
                    </div>
                </div>
                <div className={`${style.cardBack} bg-[url('/assets/icons-bg.jpg')] bg-no-repeat bg-center bg-cover relative overflow-hidden`}>
                    <div className='absolute inset-0 bg-black/90 flex justify-center items-center flex-col'>
                        <h3 className='text-teal-500 xl:text-2xl text-2xl lg:text-xl font-bold uppercase'>{heading}</h3>
                        <Link href={url} className='text-white text-lg underline'>View More</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TypeCards