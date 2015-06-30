(function(namespace, JSZip, toGeoJSON) {
    'use strict';

    namespace.KMLParser = {

        FILTROS: [
            'styleUrl',
            'styleHash'
        ],

        convertToKml: function(kmz) {
            var zip = new JSZip(binaryString);

            if (zip.files.hasOwnProperty('doc.kml')) {

                return zip.files['doc.kml'];

            } else {
                throw new Error('Invalid KMZ file');
            }

        },

        loadKML: function(text, type) {
            var dom = new DOMParser().parseFromString(text, 'text/xml');
            var geoJson = toGeoJSON.kml(dom);
            var head = this._parseHead(geoJson);

            return {
                head: head,
                body: this._parseBody(head, geoJson, type)
            };
        },

        loadKMZ: function(binaryString) {
            var zip = new JSZip(binaryString);

            if (zip.files.hasOwnProperty('doc.kml')) {

                var dom = new DOMParser().parseFromString(
                    zip.files['doc.kml'].asText(),
                    'text/xml'
                );

                var geoJson = toGeoJSON.kml(dom);
                var head = this._parseHead(geoJson);
                var body = this._parseBody(head, geoJson);

                return {
                    head: head,
                    body: body
                };

            } else {
                throw new Error('Invalid KMZ file');
            }
        },

        _parseHead: function(featureCollection) {
            var that = this;
            return _.chain(featureCollection.features)
                .map(function(feature) {
                    return Object.keys(feature.properties);
                })
                .flatten()
                .uniq()
                .filter(function(word) {
                    return that.FILTROS.indexOf(word) === -1;
                })
                .push('geojson')
                .value();
        },

        _parseBody: function(keys, featureCollection, type) {
            return _.chain(featureCollection.features)
                /* TODO: Better logic for this filter, does not need to be
                 * called if type is null
                 */
                .filter(function(feature) {
                    if (type) {
                        if (typeof type === 'string') {
                            return feature.geometry.type === type;
                        } else {
                            return type.indexOf(feature.geometry.type) > -1;
                        }
                    } else {
                        return true;
                    }
                })
                .map(function(feature) {
                    var temp = [];
                    temp.length = keys.length;

                    _.each(Object.keys(feature.properties), function(key) {
                        var index = keys.indexOf(key);
                        if (index > -1) {
                            temp[index] = feature.properties[key];
                        }
                    });

                    temp[temp.length -1] = JSON.stringify(feature.geometry);

                    return temp;
                })
                .value();
        }
    };

})(window, JSZip, toGeoJSON);
