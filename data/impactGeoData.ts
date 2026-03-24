
export const IMPACT_GEOJSON = {
  "type": "FeatureCollection",
  "features": [
    // Madagascar (Eden Projects)
    {
      "type": "Feature",
      "properties": {
        "id": "eden-1",
        "organization_name": "eden",
        "name": "Mahajanga Mangroves",
        "year": 2024,
        "type": "thriving",
        "trees_planted": 50000,
        "area_ha": 20
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [46.3, -15.7], [46.4, -15.7], [46.4, -15.8], [46.3, -15.8], [46.3, -15.7]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "eden-2",
        "organization_name": "eden",
        "name": "Antsanitia Expansion",
        "year": 2025,
        "type": "active",
        "trees_planted": 75000,
        "area_ha": 35
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [46.45, -15.65], [46.55, -15.65], [46.55, -15.75], [46.45, -15.75], [46.45, -15.65]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "eden-3",
        "organization_name": "eden",
        "name": "Boeny Coast Restoration",
        "year": 2026,
        "type": "target",
        "trees_planted": 120000,
        "area_ha": 55
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [46.2, -15.85], [46.35, -15.85], [46.35, -15.95], [46.2, -15.95], [46.2, -15.85]
        ]]
      }
    },

    // Philippines (Visayas/Negros - Talarak Foundation inspiration)
    {
      "type": "Feature",
      "properties": {
        "id": "bakuran-1",
        "organization_name": "bakuran", // NGO mentioned in spec
        "name": "Negros Occidental Bio-Corridor",
        "year": 2024,
        "type": "thriving",
        "trees_planted": 30000,
        "area_ha": 12
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [123.0, 10.3], [123.1, 10.3], [123.1, 10.2], [123.0, 10.2], [123.0, 10.3]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "bakuran-2",
        "organization_name": "bakuran",
        "name": "Mount Kanlaon Buffer Zone",
        "year": 2025,
        "type": "active",
        "trees_planted": 45000,
        "area_ha": 18
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [123.15, 10.4], [123.25, 10.4], [123.25, 10.3], [123.15, 10.3], [123.15, 10.4]
        ]]
      }
    },

    // Brazil (Tree-Nation)
    {
      "type": "Feature",
      "properties": {
        "id": "tree-nation-1",
        "organization_name": "tree-nation",
        "name": "Amazonas Heart",
        "year": 2024,
        "type": "thriving",
        "trees_planted": 200000,
        "area_ha": 150
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [-60.0, -3.0], [-59.8, -3.0], [-59.8, -3.2], [-60.0, -3.2], [-60.0, -3.0]
        ]]
      }
    },

    // Kenya (Green Belt)
    {
      "type": "Feature",
      "properties": {
        "id": "greenbelt-1",
        "organization_name": "greenbelt",
        "name": "Aberdare Range Belt",
        "year": 2024,
        "type": "thriving",
        "trees_planted": 80000,
        "area_ha": 45
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [36.6, -0.4], [36.8, -0.4], [36.8, -0.6], [36.6, -0.6], [36.6, -0.4]
        ]]
      }
    }
  ]
};
