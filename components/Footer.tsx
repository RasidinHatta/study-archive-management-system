import React from 'react'

const Footer = () => {
    return (
        <footer className="bg-muted-foreground text-background text-center py-8">
            <p className="text-sm">&copy; 2025 SAMS. All rights reserved.</p>
            <div className="mt-2 space-x-4">
                <a href="#" className="hover:underline">Privacy Policy</a>
                <a href="#" className="hover:underline">Terms of Use</a>
                <a href="#" className="hover:underline">Support</a>
            </div>
        </footer>
    )
}

export default Footer