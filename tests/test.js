var expect = chai.expect;
var should = chai.should();

describe('KML Parsing', function() {

    it('Should parse a KML and return an object', function() {
        expect(typeof KMLParser.loadKML(kmlString)).to.be.equal('object');
    });

    it('Should have head and body as keys on the Parsed KML', function() {
        expect(KMLParser.loadKML(kmlString)).to.have.all.keys(['head', 'body']);
    });

    it('Should have a geojson value on head values', function() {
        expect(KMLParser.loadKML(kmlString).head).to.include.any.members(['geojson']);
    });

    // TODO: Find a better way to do this:
    it('Should have the same number of members on head and members of body', function() {
        var parsed = KMLParser.loadKML(kmlString);
        var sameNumber = true;

        parsed.body.forEach(function(bodyItem) {
            if (bodyItem.length !== parsed.head.length) {
                sameNumber = false;
            }
        });

        expect(sameNumber).to.be.equal(true);
    });

});
