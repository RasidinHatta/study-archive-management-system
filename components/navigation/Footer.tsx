import Link from 'next/link'
import React from 'react'
import Logo from '../resources/logos/Logo'
import SocialMedias from '../resources/SocialMedias'

const Footer = () => {
    return (
        <footer className="py-16 md:py-32">
            <div className="mx-auto max-w-5xl px-6">
                <Link
                    href="/"
                    aria-label="go home"
                    className="mx-auto block size-fit">
                    <Logo />
                </Link>

                <div className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    <Link
                        href="/privacy"
                        className="text-muted-foreground hover:text-primary transition-colors px-2 py-1"
                    >
                        Privacy Policy
                    </Link>
                    <Link
                        href="/terms"
                        className="text-muted-foreground hover:text-primary transition-colors px-2 py-1"
                    >
                        Terms of Service
                    </Link>
                    <Link
                        href="/contact"
                        className="text-muted-foreground hover:text-primary transition-colors px-2 py-1"
                    >
                        Contact
                    </Link>
                    <Link
                        href="/about"
                        className="text-muted-foreground hover:text-primary transition-colors px-2 py-1"
                    >
                        About
                    </Link>
                </div>
                <SocialMedias />
                <span className="text-muted-foreground block text-center text-sm">
                    © {new Date().getFullYear()} StudyArchive, All rights reserved
                </span>
            </div>
        </footer>
    )
}

export default Footer