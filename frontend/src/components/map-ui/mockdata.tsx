import type { SearchOutput } from "./types";

/**
 * Temporary mockdata until the backend is integrated.
 */

export const projectBookmarksMockData = [1, 6, 10];
export const organizationBookmarksMockData = [8, 36, 72];

export const searchOutputMockdata: SearchOutput = {
  rankings: [
    {
      entry: {
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
          projectCount: 5,
        },
      },
      percentageMatch: 100,
    },
    {
      entry: {
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
        },
      },
      percentageMatch: 90,
    },
    {
      entry: {
        type: "Organization",
        content: {
          id: 2,
          name: "New Roots",
          description: "New Roots ist ...",
          foundingYear: 2022,
          memberCount: 7,
          iconUrl:
            "https://lirp.cdn-website.com/58002456/dms3rep/multi/opt/IMG_6945-1920w.jpg",
          imageUrls: ["path/to/image/url.pic"],
          webPageUrl: "path/to/new/roots.de",
          donatePageUrl: "path/to/new/roots/donation/link.de",
          coordinates: [-76.53063297271729, 39.18174077994108],
          tags: [4, 5, 6],
          regionName: "Deutschland",
          projectCount: 5,
        },
      },
      percentageMatch: 80,
    },
    {
      entry: {
        type: "Project",
        content: {
          id: 2,
          orgaId: 2,
          name: "Watamu Stuffs",
          description: "Stuff in Watamu",
          dateFrom: "2022",
          dateTo: "2026",
          iconUrl:
            "https://lirp.cdn-website.com/58002456/dms3rep/multi/opt/IMG_6945-1920w.jpg",
          imageUrls: [],
          webPageUrl: "",
          donatePageUrl: "",
          coordinates: [1, 1],
          tags: [4, 5, 6],
          regionName: "Kenia",
          orgaName: "New Roots",
        },
      },
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
          coordinates: [-123.09904770986309, 49.26350515893683],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 2,
        },
        geometry: {
          type: "Point",
          coordinates: [11.570039231261898, 48.14056965960426],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 3,
        },
        geometry: {
          type: "Point",
          coordinates: [15.570039231261898, 48.14056965960426],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 4,
        },
        geometry: {
          type: "Point",
          coordinates: [11.570039231261898, 52.14056965960426],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 5,
        },
        geometry: {
          type: "Point",
          coordinates: [20.570039231261898, 59.14056965960426],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 6,
        },
        geometry: {
          type: "Point",
          coordinates: [25.570039231261898, 64.140565960426],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 7,
        },
        geometry: {
          type: "Point",
          coordinates: [8.570039231261898, 49.14056965960426],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 8,
        },
        geometry: {
          type: "Point",
          coordinates: [10.570039231261898, 49.14056965960426],
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
          id: 1,
        },
        geometry: {
          type: "Point",
          coordinates: [-62.63905488319139, -4.60641653008784],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 2,
        },
        geometry: {
          type: "Point",
          coordinates: [40.02489139415981, -3.3422123425374335],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 3,
        },
        geometry: {
          type: "Point",
          coordinates: [45.02489139415981, 0.3422123425374335],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 4,
        },
        geometry: {
          type: "Point",
          coordinates: [50.02489139415981, -3.3422123425374335],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 5,
        },
        geometry: {
          type: "Point",
          coordinates: [50.02489139415981, -7.3422123425374],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 6,
        },
        geometry: {
          type: "Point",
          coordinates: [48.02489139415981, 5.3123425374335],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 7,
        },
        geometry: {
          type: "Point",
          coordinates: [39.02489139415981, -2.3422123425374335],
        },
      },
      {
        type: "Feature",
        properties: {
          id: 8,
        },
        geometry: {
          type: "Point",
          coordinates: [52.02489139415981, -13.22123425374335],
        },
      },
    ],
  },
};
