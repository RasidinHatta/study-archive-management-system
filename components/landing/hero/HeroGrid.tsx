import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import InteractiveGrid from './InteractiveGrid'
import { AnimatedGroup } from '../AnimatedGroup'
import { AnimatedText } from '../AnimatedText'

const HeroGrid = () => {
    return (
        <section className="min-h-screen flex flex-col justify-center items-center px-4 text-center">
            {/* Interactive animated grid background */}
            <InteractiveGrid />
            <AnimatedGroup
                preset="blur-slide"
                className="pointer-events-none flex flex-col items-center gap-6 text-center"
            >
                <div>
                    <AnimatedText
                        as="h1"
                        className="mb-6 text-2xl font-bold tracking-tight text-pretty lg:text-5xl"
                    >
                        Welcome to Study<span className="text-primary">TEST</span>
                    </AnimatedText>
                    <AnimatedText
                        as="p"
                        className="text-muted-foreground mx-auto max-w-3xl lg:text-xl"
                        delay={0.15}
                    >
                        Seamlessly upload, read, and share documents from your always-accessible digital library.
                    </AnimatedText>
                </div>
                <AnimatedGroup
                    preset="slide"
                    className="pointer-events-auto mt-6 flex justify-center gap-3"
                >
                    <Button asChild size="lg" className="text-background rounded-full px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg">
                        <Link href="/register">
                            Get Started
                        </Link>
                    </Button>
                    <Button
                        asChild
                        size="lg"
                        className="rounded-full px-8 transition-all duration-300 hover:scale-105 hover:bg-foreground hover:text-background bg-accent text-foreground"
                    >
                        <Link href="/community">
                            Browse Documents{" "}
                            <ExternalLink className="ml-2 h-4 transition-transform group-hover:translate-x-0.5" />
                        </Link>
                    </Button>
                </AnimatedGroup>
            </AnimatedGroup>
        </section>
    )
}

export default HeroGrid