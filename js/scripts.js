(function(namespace) {
    'use strict';

    function _updateDom(keys, body) {

        var thead = _.map(keys, function(key) {
            return $('<td>').text(key);
        });

        var tbody = _.map(body, function(val) {
            var tds = _.map(val, function(value) {
                return $('<td>').text(value);
            });

            return $('<tr>').append(tds);
        });

        var head = $('.thead');
        var table = $('table');

        head.append(thead);
        table.append(tbody);
    }

    function _onLoadKmz(evt) {
        if (evt.target.readyState !== 2) return;

        if (evt.target.error) {
            alert('Error while reading file');
            return;
        }

        var result = KMLParser.loadKMZ(evt.target.result);
        _updateDom(result.head, result.body);
    }

    function _onLoadKml(evt) {

        if (evt.target.readyState !== 2) return;

        if (evt.target.error) {
            alert('Error while reading file');
            return;
        }

        var result = KMLParser.loadKML(evt.target.result);
        _updateDom(result.head, result.body);
    }

    namespace.change = function() {
        var input = $('#kml');
        var textArea = $('#textArea');
        var kml = input[0].files[0];
        var fileExtension = kml.name.split('.')[kml.name.split('.').length - 1].toLowerCase();
        var reader = new FileReader();

        if (fileExtension === 'kmz') {
            reader.onload = _onLoadKmz;
            reader.readAsBinaryString(kml);
        } else if (fileExtension === 'kml') {
            reader.onload = _onLoadKml;
            reader.readAsText(kml);
        } else {
            alert('Não é um kml nem kmz irmão, ajeita essa porra ai');
        }
    }

}(window));
