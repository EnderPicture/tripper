export interface Geometry {
	coordinates: number[];
	type: string;
}

export interface Properties {
	osm_type: string;
	osm_id: any;
	extent: number[];
	country: string;
	osm_key: string;
	countrycode: string;
	osm_value: string;
	name: string;
	county: string;
	state: string;
	type: string;
	city: string;
	postcode: string;
	street: string;
	district: string;
}

export interface Feature {
	geometry: Geometry;
	type: string;
	properties: Properties;
}

export interface PhotonGeocodingResponse {
	features: Feature[];
	type: string;
}
