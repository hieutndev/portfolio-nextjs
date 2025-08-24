import React from "react";
import { Metadata } from "next";

import Container from "@/components/shared/container/container";
import AdminHeader from "@/components/shared/partials/admin-header";

export const metadata: Metadata = {
    title: "Dashboard"
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return <Container
        shadow
        className="border border-gray-200 rounded-2xl h-max"
        orientation="vertical"
    >
        <AdminHeader
            breadcrumbs={['Admin', 'Dashboard']}
            title="Analytics Dashboard"
        />
        {children}
    </Container>;
}