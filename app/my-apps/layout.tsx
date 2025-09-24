import Container from "@/components/shared/container/container";

export default function MyAppsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Container gapSize={8} orientation={"vertical"} >
      <div className={"flex flex-col gap-2"}>
        <h1 className={"text-4xl font-extrabold"}>My Applications</h1>
        <p className={"text-sm italic"}>Applications built with curiosity, passion, and a lot of coffee</p>
      </div>
      {children}
    </Container>
  );
}
