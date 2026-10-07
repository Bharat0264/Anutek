import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"AnuTek Solutions | Enterprise Technical Deployments",description:"Enterprise hardware, technical deployment and interactive system solutions from Hyderabad.",icons:{icon:"/favicon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
