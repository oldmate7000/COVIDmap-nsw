const React = require('react')
const $ = require('jquery')

class baseStateComponent extends React.Component {
    constructor(props){
        super(props)
    }

    mapFromServer(stateID) {
        // console.log("sending request for WA LGA's map")
        return $.getJSON(window.location.origin + '/maps', {state:stateID})
    }

    COVIDFromServer(stateID) {
        // console.log('getting covid numbers for WA')
        return $.getJSON('/getCOVIDdata', {state:stateID})
    }

    highlightFeature(e) {
        var layer = e.target;
    
        layer.setStyle({
            fillOpacity: 0.85
        });
    }
    
    resetHighlight(e) {
        var layer = e.target;
    
        layer.setStyle({
            fillOpacity: 0.3
        });
    }

    getServerUpdate(stateID) {
        // console.log('getPostalAreas')
        this.mapFromServer(stateID).then((data) => {
            // console.log(data)
            this.setState({
                map: data
            })
            this.getCOVIDNumbers()
        })
    }
}

export default baseStateComponent