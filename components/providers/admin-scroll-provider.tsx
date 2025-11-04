"use client";

import React, { createContext, useContext, RefObject } from 'react';

interface AdminScrollContextType {
    scrollContainerRef: RefObject<HTMLDivElement | null> | null;
}

const AdminScrollContext = createContext<AdminScrollContextType>({
    scrollContainerRef: null
});

export function AdminScrollProvider({
    children,
    scrollContainerRef
}: {
    children: React.ReactNode;
    scrollContainerRef: RefObject<HTMLDivElement | null>;
}) {
    return (
        <AdminScrollContext.Provider value={{ scrollContainerRef }}>
            {children}
        </AdminScrollContext.Provider>
    );
}

export function useAdminScroll() {
    return useContext(AdminScrollContext);
}

