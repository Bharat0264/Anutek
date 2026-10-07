export type SpecRow = [string, string[]];
export type ProductSpec = { models: string[]; rows: SpecRow[] };

const sharedDesktopRows = (formFactor: string): SpecRow[] => [
  ["Specification", ["Intel i3", "Intel i5", "Intel i7", "Intel i9"]],
  ["CPU Support", ["Intel Core i3 (12th–14th Gen)", "Intel Core i5 (12th–14th Gen)", "Intel Core i7 (12th–14th Gen)", "Intel Core i9 (12th–14th Gen)"]],
  ["Chipset", Array(4).fill("Intel H, P, Z as required")],
  ["Memory", Array(4).fill("DDR4 up to 64GB, Dual Channel")],
  ["Graphics", Array(4).fill("Integrated/Discrete, HDMI, DP, D-Sub")],
  ["Expansion Slots", Array(4).fill("1× PCIe 4.0 x16, 1× PCIe 3.0 x1")],
  ["Storage", Array(4).fill("2× M.2, 4× SATA 6Gb/s")],
  ["Networking", Array(4).fill("Realtek 1Gb Ethernet")],
  ["USB Ports", Array(4).fill("6× USB Front, 4× USB Rear")],
  ["Audio", Array(4).fill("Realtek 7.1 Surround, HD Audio")],
  ["Form Factor", Array(4).fill(formFactor)],
  ["Monitor (Optional)", Array(4).fill("21.5* Bezel less Spk Monitor")],
  ["Keyboard and Mouse (Optional)", Array(4).fill("Standard USB")],
];

export const productSpecs: Record<string, ProductSpec> = {
  "thin-clients": { models: ["TC 100", "TC 500 (VDI)", "TC 800 (Cloud)"], rows: [
    ["Form Factor", Array(3).fill("Remote PC (Thin Clients)")], ["Power adaptor", Array(3).fill("5V/2A")], ["Processor", Array(3).fill("Dual Core 1.2GHz ARM Cortex")], ["Chipset", Array(3).fill("H610 Chipset")], ["RAM", Array(3).fill("DDR3 1GB")], ["SSD", Array(3).fill("4 GB Flash")], ["Operating System", Array(3).fill("Linux")], ["USB Ports", Array(3).fill("4× USB 2.0")], ["Networking", Array(3).fill("LAN Port")], ["Display", Array(3).fill("VGA and HDMI Display Support Up to 1920 × 1200")], ["Monitor", Array(3).fill("21.5* Bezel less Spk Monitor")], ["Keyboard & Mouse", Array(3).fill("Standard USB")], ["Warranty", Array(3).fill("3 Years")],
  ] },
  "mini-pc": { models: ["M 3000", "M 5000", "M 7000", "M 9000"], rows: [
    ["Specification", ["Intel i3", "Intel i5", "Intel i7", "Intel i9"]], ["CPU Support", ["Intel Core i3 (12th–14th Gen)", "Intel Core i5 (12th–14th Gen)", "Intel Core i7 (12th–14th Gen)", "Intel Core i9 (12th–14th Gen)"]], ["Chipset", Array(4).fill("Intel H, P, Z as required")], ["Memory", Array(4).fill("DDR4 up to 64GB, Dual Channel")], ["Graphics", Array(4).fill("Integrated/Discrete, HDMI, DP, D-Sub")], ["VESA Mounting", Array(4).fill("Universal")], ["Storage", Array(4).fill("2× M.2, 4× SATA 6Gb/s")], ["Networking", Array(4).fill("Realtek 1Gb Ethernet")], ["USB Ports", Array(4).fill("6× USB Front, 4× USB Rear")], ["Audio", Array(4).fill("Realtek 7.1 Surround, HD Audio")], ["Form Factor", Array(4).fill("Mini ITX (226x136x288MM)")], ["Monitor (Optional)", Array(4).fill("21.5* Bezel less Spk Monitor")], ["Keyboard and Mouse (Optional)", Array(4).fill("Standard USB")],
  ] },
  "tower-desktop": { models: ["T 3000", "T 5000", "T 7000", "T 9000"], rows: sharedDesktopRows("mATX (24.4 cm x 21.1 cm)") },
  "desktop-pc": { models: ["T 3000", "T 5000", "T 7000", "T 9000"], rows: sharedDesktopRows("ATX (27 cm x 23 cm)") },
  "all-in-one": { models: ["T 3000", "T 5000", "T 7000", "T 9000"], rows: sharedDesktopRows("ATX (27 cm x 23 cm)") },
};
