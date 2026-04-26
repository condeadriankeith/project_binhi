export const IMPACT_GEOJSON = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "bakuran-1",
        "organization_name": "BCC Advocates for Kalikasan (BAKURAN)",
        "name": "Northern Negros NP Restoration",
        "year": 2024,
        "type": "thriving",
        "trees_planted": 45000,
        "area_ha": 25,
        "co2_sequestered": 112500,
        "carbon_offset_tons": 112.5,
        "avg_tree_age": 3.5,
        "biodiversity_score": 92
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [123.15, 10.65], [123.25, 10.65], [123.25, 10.55], [123.15, 10.55], [123.15, 10.65]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "earthguards-1",
        "organization_name": "EarthGuards USLS",
        "name": "Bacolod Urban Canopy Project",
        "year": 2025,
        "type": "active",
        "trees_planted": 12000,
        "area_ha": 5,
        "co2_sequestered": 28500,
        "carbon_offset_tons": 28.5,
        "avg_tree_age": 1.2,
        "biodiversity_score": 78
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [122.95, 10.68], [123.00, 10.68], [123.00, 10.63], [122.95, 10.63], [122.95, 10.68]
        ]]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "bakuran-2",
        "organization_name": "BCC Advocates for Kalikasan (BAKURAN)",
        "name": "Don Salvador Benedicto Corridor",
        "year": 2026,
        "type": "target",
        "trees_planted": 65000,
        "area_ha": 30,
        "co2_sequestered": 162500,
        "carbon_offset_tons": 162.5,
        "avg_tree_age": 2.1,
        "biodiversity_score": 88
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[
          [123.35, 10.58], [123.45, 10.58], [123.45, 10.48], [123.35, 10.48], [123.35, 10.58]
        ]]
      }
    }
  ]
};

// Carbon footprint statistics by organization
export const ORG_CARBON_STATS = {
  "BCC Advocates for Kalikasan (BAKURAN)": {
    totalTrees: 110000,
    totalCO2: 275000,
    carbon_offset_tons: 275,
    yearlyOffset: 82500,
    equivalentCars: 18,
    equivalentFlights: 450,
    forestHealth: "Excellent",
    carbonIntensity: "High Sequestration",
    lastAssessment: "2026-04-15"
  },
  "EarthGuards USLS": {
    totalTrees: 12000,
    totalCO2: 28500,
    carbon_offset_tons: 28.5,
    yearlyOffset: 8500,
    equivalentCars: 2,
    equivalentFlights: 47,
    forestHealth: "Good",
    carbonIntensity: "Urban Standard",
    lastAssessment: "2026-03-20"
  }
};
