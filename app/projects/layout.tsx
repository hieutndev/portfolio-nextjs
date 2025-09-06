import Container from "@/components/shared/container/container";

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return (
        <Container className="w-full shadow-2xl py-0">
            {children}
        </Container>
    );
}
