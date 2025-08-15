import Container from "@/components/shared/container/container";

export default function MyAppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container orientation={"vertical"} gapSize={8} >
      <div className={"flex flex-col gap-2"}>
        <h1 className={"text-4xl font-bold"}>My Applications</h1>
        <p className={"text-sm italic"}>Applications built with curiosity, passion, and a lot of coffee</p>
      </div>
      {children}
    </Container>
  );
}
