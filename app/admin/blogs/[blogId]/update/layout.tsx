import Container from "@/components/shared/container/container";
import AdminHeader from "@/components/shared/partials/admin-header";
import ICON_CONFIG from "@/configs/icons";
import ROUTE_PATH from "@/configs/route-path";

export default function UpdateBlogLayout({ children }: { children: React.ReactNode }) {
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
                    href: ROUTE_PATH.ADMIN.BLOG.INDEX,
                }}
                breadcrumbs={["Blogs", "Update Blog"]}
                title={"Update Blog"}
            />
            {children}
        </Container>
    );
}