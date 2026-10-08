export type ProductVideo = { src: string; poster: string; title: string };

// Only verified, client-supplied footage is listed here. Omit an entry to hide the film control.
export const productVideos: Record<string, ProductVideo> = {
  "mini-pc": { src: "/product-videos/mini-pc.mp4", poster: "/legacy/mini-pc/1.jpg", title: "Mini PC" },
  "compute-stick": { src: "/product-videos/compute-stick.mp4", poster: "/exploded/monitor-stick.png", title: "Compute Stick" },
  "all-in-one": { src: "/product-videos/all-in-one.mp4", poster: "/legacy/all-in-one/1.jpg", title: "All-in-One System" },
  "mobile-cart": { src: "/product-videos/mobile-cart.mp4", poster: "/exploded/mobile-stand.png", title: "Mobile Cart" },
};
