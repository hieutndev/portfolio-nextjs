import React from 'react'

import AdminHeader from '@/components/shared/partials/admin-header'
import ICON_CONFIG from '@/configs/icons'
import ROUTE_PATH from '@/configs/route-path'
import Container from '@/components/shared/container/container'

const UpdateProjectLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Container
            shadow
            className={"border border-default-200 rounded-2xl h-max"}
            orientation={"vertical"}
        >
            <AdminHeader
                backButton={{
                    color: "default",
                    size: "md",
                    variant: "solid",
                    startContent: ICON_CONFIG.BACK,
                    text: "Back",
                    href: ROUTE_PATH.ADMIN.PROJECT.INDEX,
                }}
                breadcrumbs={["Projects", "Update Project"]}
                title={"Update Project"}
            />
            {children}
        </Container>
    )
}

export default UpdateProjectLayout