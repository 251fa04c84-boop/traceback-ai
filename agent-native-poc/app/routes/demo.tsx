import PublicDemoPage from "./_index";

export function meta() {
  return [
    { title: "TraceBack AI · Public incident benchmark" },
    {
      name: "description",
      content: "Explore TraceBack AI's read-only synthetic incident investigation benchmark.",
    },
  ];
}

export default function DemoRoute() {
  return <PublicDemoPage />;
}
