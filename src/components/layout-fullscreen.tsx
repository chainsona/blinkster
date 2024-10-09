"use client";

import Div100vh from "react-div-100vh";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function LayoutFullscreen({ children }: Props) {
  return <Div100vh>{children}</Div100vh>;
}
