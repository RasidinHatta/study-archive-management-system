import React from 'react'

const ErrorLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-full bg-background p-8 rounded-none shadow-none text-center flex flex-col items-center justify-center">
      {children}
    </div>
  )
}

export default ErrorLayout
