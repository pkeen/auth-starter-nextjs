import React, { ReactNode } from "react";
import "../globals.css";

type Props = {
	children: ReactNode;
};

export default function layout({ children }: Props) {
	return <div className="bg-slate-950">{children}</div>;
}
