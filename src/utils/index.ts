import { Site } from "@/types";

export const getAddress = (site: Site) => {
  if (site.address) {
    const { street, city } = site.address;
    return `${street}, ${city}`;
  }
  return "";
};

export const getContact = (site: Site) => {
  if (site?.contacts?.main) {
    const { firstName, lastName } = site.contacts.main;
    return `${firstName} ${lastName}`;
  }
  return "";
};

export const getAvatar = (site: Site) => {
  if (site?.images?.length) {
    return site?.images[0];
  }
  return "/";
};
