var expect = chai.expect;
var should = chai.should();

describe('KML Parsing', function() {

    it('Should parse a KML and return an object', function() {
        expect(typeof KMLParser.loadKML(kmlString[0])).to.be.equal('object');
    });

    it('Should have head and body as keys on the Parsed KML', function() {
        expect(KMLParser.loadKML(kmlString[0])).to.have.all.keys(['head', 'body']);
    });

    it('Should have a geojson value on head values', function() {
        expect(KMLParser.loadKML(kmlString[0]).head).to.include.any.members(['geojson']);
    });

    // TODO: Find a better way to do this:
    it('Should have the same number of members on head and members of body', function() {
        var parsed = KMLParser.loadKML(kmlString[0]);
        var sameNumber = true;

        parsed.body.forEach(function(bodyItem) {
            if (bodyItem.length !== parsed.head.length) {
                sameNumber = false;
            }
        });

        expect(sameNumber).to.be.equal(true);
    });


    it('Should ignore geometies that aren\'t points when point parameter is passed', function() {
        var parsed = KMLParser.loadKML(kmlString[1], 'Point');
        var index = parsed.head.indexOf('geojson');

        var geometry = _.chain(parsed.body)
                            .map(function(geo) {
                                return JSON.parse(geo[index]);
                            })
                            .filter(function(point) {
                                return point.type !== 'Point';
                            })
                            .value();

        expect(geometry).to.have.length.below(1);
    });

    it('Should ignore geometies that aren\'t linestrings when linestring parameter is passed', function() {

        var parsed = KMLParser.loadKML(kmlString[1], 'LineString');
        var index = parsed.head.indexOf('geojson');

        var geometry = _.chain(parsed.body)
                            .map(function(geo) {
                                return JSON.parse(geo[index]);
                            })
                            .filter(function(point) {
                                return point.type !== 'LineString';
                            })
                            .value();

        expect(geometry).to.have.length.below(1);
    });

    it('Should ignore geometies that aren\'t Polygons when linestring parameter is passed', function() {

        var parsed = KMLParser.loadKML(kmlString[1], 'Polygon');
        var index = parsed.head.indexOf('geojson');

        var geometry = _.chain(parsed.body)
                            .map(function(geo) {
                                return JSON.parse(geo[index]);
                            })
                            .filter(function(point) {
                                return point.type !== 'Polygon';
                            })
                            .value();

        expect(geometry).to.have.length.below(1);
    });

    it('Should ignore parse a KML with more than one type of geometry and return only points', function() {
        var parsed = KMLParser.loadKML(kmlString[1], 'Point');
        var index = parsed.head.indexOf('geojson');

        var geometry = _.chain(parsed.body)
                            .map(function(geo) {
                                return JSON.parse(geo[index]);
                            })
                            .filter(function(point) {
                                return point.type === 'Point';
                            })
                            .value();

        expect(geometry).to.have.length.above(0);
    });

    it('Should ignore parse a KML with more than one type of geometry and return only LineStrings', function() {
        var parsed = KMLParser.loadKML(kmlString[1], 'LineString');
        var index = parsed.head.indexOf('geojson');

        var geometry = _.chain(parsed.body)
                            .map(function(geo) {
                                return JSON.parse(geo[index]);
                            })
                            .filter(function(point) {
                                return point.type === 'LineString';
                            })
                            .value();

        expect(geometry).to.have.length.above(0);
    });

    it('Should ignore parse a KML with more than one type of geometry and return only Polygons', function() {
        var parsed = KMLParser.loadKML(kmlString[1], 'Polygon');
        var index = parsed.head.indexOf('geojson');

        var geometry = _.chain(parsed.body)
                            .map(function(geo) {
                                return JSON.parse(geo[index]);
                            })
                            .filter(function(point) {
                                return point.type === 'Polygon';
                            })
                            .value();

        expect(geometry).to.have.length.above(0);
    });

    it('Should return 0 results when parser receives 0 results of the type of geometry specified (Array)', function() {

        var parsed = KMLParser.loadKML(kmlString[1], ['MultiPolygon']);
        var index = parsed.head.indexOf('geojson');

        var geometry = _.chain(parsed.body)
                            .map(function(geo) {
                                return JSON.parse(geo[index]);
                            })
                            .filter(function(point) {
                                return ['MultiPolygon'].indexOf(point.type) > -1;
                            })
                            .value();

        expect(geometry).to.have.length.below(1);
    });

    it('Should return 0 results when parser receives 0 results of the type of geometry specified (String)', function() {

        var parsed = KMLParser.loadKML(kmlString[1], 'MultiPolygon');
        var index = parsed.head.indexOf('geojson');

        var geometry = _.chain(parsed.body)
                            .map(function(geo) {
                                return JSON.parse(geo[index]);
                            })
                            .filter(function(point) {
                                return 'MultiPolygon' === point.type;
                            })
                            .value();

        expect(geometry).to.have.length.below(1);
    });

    it('Should ignore parse a KML with more than one type of geometry and return only geometries inside the array passed', function() {

        var parsed = KMLParser.loadKML(kmlString[1], ['Polygon', 'Point']);
        var index = parsed.head.indexOf('geojson');

        var geometry = _.chain(parsed.body)
                            .map(function(geo) {
                                return JSON.parse(geo[index]);
                            })
                            .filter(function(point) {
                                return ['Polygon', 'Point'].indexOf(point.type) > -1;
                            })
                            .value();

        expect(geometry).to.have.length.above(0);
    });

});
