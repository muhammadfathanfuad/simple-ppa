
export const isPointInPolygon = (point, vs) => {
    // point: [lat, lng]
    // vs: array of [lat, lng] points forming the polygon

    // ray-casting algorithm based on
    // https://github.com/substack/point-in-polygon

    var x = point[0], y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        var xi = vs[i][0], yi = vs[i][1];
        var xj = vs[j][0], yj = vs[j][1];

        var intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};

const checkPolygon = (lat, lng, feature) => {
    const geometry = feature.geometry;
    if (!geometry) return false;

    if (geometry.type === 'Polygon') {
        return isPointInPolygon([lng, lat], geometry.coordinates[0]);
    } else if (geometry.type === 'MultiPolygon') {
        for (const polygon of geometry.coordinates) {
            if (isPointInPolygon([lng, lat], polygon[0])) return true;
        }
    }
    return false;
};

export const findKecamatanByLocation = (lat, lng, kecamatanList) => {
    // Check all polygons and collect matches to handle overlaps
    const matches = [];

    for (const kec of kecamatanList) {
        if (!kec.fileGeojson) continue;

        try {
            const geoJson = JSON.parse(kec.fileGeojson);

            let matched = false;
            // Handle different GeoJSON types
            if (geoJson.type === 'FeatureCollection') {
                for (const feature of geoJson.features) {
                    if (checkPolygon(lat, lng, feature)) {
                        matched = true;
                        break;
                    }
                }
            } else if (geoJson.type === 'Feature') {
                if (checkPolygon(lat, lng, geoJson)) {
                    matched = true;
                }
            }

            if (matched) {
                matches.push(kec);
            }

        } catch (e) {
            console.error("Error parsing GeoJSON for kecamatan:", kec.namaKecamatan, e);
        }
    }

    if (matches.length === 0) return null;
    if (matches.length === 1) return matches[0];

    // Priority Handling for Overlaps
    // Known overlap: Kambu often covers Baruga details. Prefer Baruga.
    const baruga = matches.find(m => m.namaKecamatan === 'Baruga');
    if (baruga) return baruga;

    return matches[0];
};

export const findNearestKecamatan = (lat, lng, kecamatanList, thresholdMeters = 500) => {
    let closest = null;
    let minDist = Infinity;

    for (const kec of kecamatanList) {
        if (!kec.fileGeojson) continue;
        try {
            const geoJson = JSON.parse(kec.fileGeojson);

            // Get a representative point (first vertex of first polygon)
            let coords = null;
            if (geoJson.type === 'FeatureCollection' && geoJson.features.length > 0) {
                const geom = geoJson.features[0].geometry;
                if (geom.type === 'Polygon') coords = geom.coordinates[0][0];
                else if (geom.type === 'MultiPolygon') coords = geom.coordinates[0][0][0];
            } else if (geoJson.type === 'Feature') {
                const geom = geoJson.geometry;
                if (geom.type === 'Polygon') coords = geom.coordinates[0][0];
                else if (geom.type === 'MultiPolygon') coords = geom.coordinates[0][0][0];
            }

            if (coords) {
                // Coords are [lng, lat]
                const kLng = coords[0];
                const kLat = coords[1];

                // Simple Euclidean approximation for short distances (deg to meters)
                // 1 deg Lat ~= 111km
                // 1 deg Lng ~= 111km * cos(lat)
                const R = 6371e3; // metres
                const φ1 = lat * Math.PI / 180;
                const φ2 = kLat * Math.PI / 180;
                const Δφ = (kLat - lat) * Math.PI / 180;
                const Δλ = (kLng - lng) * Math.PI / 180;

                const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
                    Math.cos(φ1) * Math.cos(φ2) *
                    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const d = R * c;

                if (d < minDist) {
                    minDist = d;
                    closest = kec;
                }
            }

        } catch (e) { continue; }
    }

    if (minDist <= thresholdMeters) {
        return closest;
    }
    return null;
};
