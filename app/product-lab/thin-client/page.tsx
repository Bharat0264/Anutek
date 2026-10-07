import type { Metadata } from "next";
import ThinClientLab from "../../../components/ThinClientLab";

export const metadata: Metadata = {
  title: "Thin Client Product Lab | AnuTek Solutions",
  description: "Interactively inspect AnuTek Thin Client form, interfaces, illustrative internal architecture and enterprise deployment contexts.",
  alternates: { canonical: "/product-lab/thin-client" },
};

export default function ThinClientProductLabPage() { return <ThinClientLab/>; }
