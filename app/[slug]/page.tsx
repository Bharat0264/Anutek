import {ClientsClone,ProductClone,StandardPage} from "../AnutekSite";
export function generateStaticParams(){return ["aboutus","thin-clients","mini-pc","tower-desktop","desktop-pc","all-in-one","kiosks-display","hardware-training","our-clients","contact"].map(slug=>({slug}))}
export default async function Page({params}:{params:Promise<{slug:string}>}){const slug=(await params).slug;if(["thin-clients","mini-pc","tower-desktop","desktop-pc","all-in-one"].includes(slug))return <ProductClone slug={slug}/>;if(slug==="our-clients")return <ClientsClone/>;return <StandardPage slug={slug}/>}
