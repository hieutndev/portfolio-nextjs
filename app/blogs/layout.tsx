import Container from "@/components/shared/container/container";

export default function BlogLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Container className="w-full font-ubuntu shadow-2xl pb-16 py-0">
            {children}
        </Container>
    );
}
