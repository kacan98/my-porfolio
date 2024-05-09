import { sanityClient } from "@/sanity/lib/sanityClient";
import { Project } from "@/sanity/schemaTypes/project";
import { Settings } from "@/sanity/schemaTypes/singletons/settings";
import { Gallery } from "@/sanity/schemaTypes/gallery";
import { Link } from "@/sanity/schemaTypes/link";

export const getProjects = async (): Promise<Project[]> => {
  return sanityClient.fetch(
    `*[_type == "project"]`,
    {},
    {
      cache: "no-cache",
    },
  );
};

export const getProjectsByRefs = async (refs: string[]): Promise<Project[]> => {
  return sanityClient.fetch(
    `*[_type == "project" && _id in $refs]`,
    { refs },
    {
      cache: "no-cache",
    },
  );
};

export const getGalleries = async (): Promise<Gallery[]> => {
  return sanityClient.fetch(
    `*[_type == "gallery"]`,
    {},
    {
      cache: "no-cache",
    },
  );
};

// Can be undefined when the project is initialized
export const getSettings = async (): Promise<Settings | undefined> => {
  return sanityClient.fetch(
    `*[_type == "settings"][0]`,
    {},
    {
      cache: "no-cache",
    },
  );
};

export const getSocials = async (): Promise<Link[]> => {
  return sanityClient.fetch(
    `*[_type == "settings"][0].social`,
    {},
    {
      cache: "no-cache",
    },
  );
};

export const getProjectBySlug = async (
  slug: string,
): Promise<Project | undefined> => {
  //slug exists at project.relatedPage.slug.current
  return sanityClient.fetch(
    `*[_type == "project" && relatedPage.slug.current == $slug][0]`,
    { slug },
    {
      cache: "no-cache",
    },
  );
};
