import React from 'react'

const Logo = () => {
    return (
        <div className="flex flex-row items-center group gap-3">
            <span className="font-bold text-lg transition-transform hover:scale-105 hover:text-primary">[S][A]</span>
            <span className="text-2xl md:text-3xl font-bold text-foreground group-hover:text-primary transition-colors">
                Study<span className="text-primary">Archive</span>
            </span>
        </div>
    )
}

export default Logo