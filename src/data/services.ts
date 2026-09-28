import servicesJson from "./services.json";

export type Service = {
  slug: string;
  name: string;
  price: number;
  short: string;
  note?: string;
  featureGroups: { title?: string; items: string[] }[];
};

export const services: Service[] = servicesJson as Service[];

export const getService = (slug: string) => services.find((s) => s.slug === slug);
export const allFeatures = (s: Service) => s.featureGroups.flatMap((g) => g.items);
export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
