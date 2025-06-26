import React from 'react';
    import Sidebar from './Sidebar';
    import Topbar from './Topbar';
    import { Toaster } from "@/components/ui/toaster";
    import { MotionConfig } from 'framer-motion';

    export const Layout = ({ children, currentRole }) => {
      return (
        <MotionConfig transition={{ duration: 0.2, ease: "easeInOut" }}>
          <div className="min-h-screen flex bg-secondary/30">
            <Sidebar currentRole={currentRole} />
            <div className="flex-1 flex flex-col ml-sidebar">
              <Topbar currentRole={currentRole} />
              <main className="flex-1 p-6 pt-20"> 
                {children}
              </main>
            </div>
            <Toaster />
          </div>
        </MotionConfig>
      );
    };