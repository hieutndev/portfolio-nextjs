import { Metadata } from "next";

import Container from "@/components/shared/container/container";
import AdminHeader from "@/components/shared/partials/admin-header";

export const metadata: Metadata = {
    title: "Admin - Settings",
};

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
    return <Container
        shadow
        className={"border border-default-200 rounded-2xl h-max"}
        orientation={"vertical"}
    >
        <AdminHeader breadcrumbs={["Admin", "Settings"]} title={"Settings"} />
        {children}
    </Container>;
}
