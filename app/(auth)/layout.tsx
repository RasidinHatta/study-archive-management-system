import { ForceDarkMode } from '@/components/theme/ForceDarkMode'
import React, { Suspense } from 'react'
import Image from 'next/image'

const AuthLayout = async ({
    children
}: {
    children: React.ReactNode
}) => {
    const source = "/background/authBackground"
    const avifSource = `${source}.avif`
    const webpSource = `${source}.webp`

    return (
        <section className='w-full relative h-screen dark'>
            {/* Background with optimized Next.js Image */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <picture>
                    <source srcSet={avifSource} type="image/avif" />
                    <source srcSet={webpSource} type="image/webp" />
                    <Image
                        src={avifSource}
                        alt="Abstract background"
                        className="h-full w-full object-cover"
                        fill
                        priority={false}
                        quality={80}
                        sizes="100vw"
                    />
                </picture>
                <div className="absolute inset-0 bg-background/60 backdrop-blur-[4px]" />
            </div>

            {/* Centered content with image and form side by side */}
            <div className="h-screen flex items-center justify-center px-4">
                <div className="w-full md:w-[50%] max-w-6xl bg-background/80 rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row">
                    {/* Image side - Hidden on mobile, visible on md and up */}
                    <div className="hidden md:block md:w-1/2 relative">
                        <Image
                            src={avifSource}
                            alt="Students studying together"
                            fill
                            className="object-cover"
                            priority={false}
                            quality={80}
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                    </div>
                    {/* Form side - Full width on mobile, half width on desktop */}
                    <div className="w-screen md:w-1/2">
                        <Suspense fallback={<div>Loading...</div>}>
                            <ForceDarkMode>
                                {children}
                            </ForceDarkMode>
                        </Suspense>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default AuthLayout