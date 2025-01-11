import type { Organization, Project, SearchOutput } from "./map-ui";

export const mockdata: SearchOutput = {
  rankings: [
    {
      type: "Organization",
      content: {
        id: 1,
        name: "Greenpeace",
        description: "Save trees etc.",
        foundingYear: 1971,
        memberCount: 3_000_000,
        iconUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Greenpeace_logo.svg/250px-Greenpeace_logo.svg.png",
        imageUrls: [],
        webPageUrl: "",
        donatePageUrl: "",
        coordinates: [1, 1],
        tags: [1, 2, 3],
        regionName: "Kanada",
        numProjects: 5,
      } as Organization,
      percentageMatch: 100,
    },
    {
      type: "Project",
      content: {
        id: 1,
        orgaId: 1,
        name: "Save the trees",
        description: "Save trees etc.",
        dateFrom: "2020",
        dateTo: "2025",
        iconUrl:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Greenpeace_logo.svg/250px-Greenpeace_logo.svg.png",
        imageUrls: [],
        webPageUrl: "",
        donatePageUrl: "",
        coordinates: [1, 1],
        tags: [1, 2, 3],
        regionName: "Brasilien",
        orgaName: "Greenpeace",
      } as Project,
      percentageMatch: 90,
    },
    {
      type: "Organization",
      content: {
        id: 2,
        name: "New Roots",
        description: "New Roots ist ...",
        foundingYear: 2022,
        memberCount: 7,
        iconUrl:
          "https://lirp.cdn-website.com/58002456/dms3rep/multi/opt/Logo_w_150ppi-134w.png",
        imageUrls: ["path/to/image/url.pic"],
        webPageUrl: "path/to/new/roots.de",
        donatePageUrl: "path/to/new/roots/donation/link.de",
        coordinates: [-76.53063297271729, 39.18174077994108],
        tags: [4, 5, 6],
        regionName: "Deutschland",
        numProjects: 5,
      } as Organization,
      percentageMatch: 80,
    },
    {
      type: "Project",
      content: {
        id: 2,
        orgaId: 2,
        name: "Watamu Stuffs",
        description: "Stuff in Watamu",
        dateFrom: "2022",
        dateTo: "2026",
        iconUrl:
          "https://lirp.cdn-website.com/58002456/dms3rep/multi/opt/Logo_w_150ppi-134w.png",
        imageUrls: [],
        webPageUrl: "",
        donatePageUrl: "",
        coordinates: [1, 1],
        tags: [4, 5, 6],
        regionName: "Kenia",
        orgaName: "New Roots",
      } as Project,
      percentageMatch: 70,
    },
  ],
  organizationLocations: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          id: 1,
        },
        geometry: {
          type: "Point",
          coordinates: [49.26350515893683, -123.09904770986309],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 2,
        },
        geometry: {
          type: "Point",
          coordinates: [48.14056965960426, 11.570039231261898],
        },
      },
    ],
  },
  projectLocations: {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          projectId: 1,
        },
        geometry: {
          type: "Point",
          coordinates: [-4.60641653008784, -62.63905488319139],
        },
      },
      {
        type: "Feature",
        properties: {
          projectId: 2,
        },
        geometry: {
          type: "Point",
          coordinates: [-3.3422123425374335, 40.02489139415981],
        },
      },
    ],
  },
};
