const React = require('react')
import Control from 'react-leaflet-control';
import baseStateComponent from './baseStateComponent'
import TopoJSON from './TopoJSON';

class WA extends baseStateComponent {
    constructor(props) {
        super(props)
        this.state = {
            updated: false,
            map: {}
        }
        this.getCOVIDNumbers = this.getCOVIDNumbers.bind(this)
        this.onEachFeature = this.onEachFeature.bind(this)
    }

    getCOVIDNumbers() {
        this.COVIDFromServer('wa').then((data) => {
            this.props.setMax('wa', data)
            // console.log(data)

            let geos = this.state.map
            geos.objects.WA_LGA_100pc_TOPO.geometries.forEach(area => {
                if(data[area.properties.LGA_NAME19]) {
                    area.properties['cvCases'] = data[area.properties.LGA_NAME19]
                } else {
                    area.properties['cvCases'] = 0
                }
            })

            // console.log(geos)
            this.setState({
                updated: true,
                map: geos,
            })
        })
    }
    
    onEachFeature(feature, layer){
        const popupContent = 
        `<Popup>
        LGA Name: ${feature.properties.LGA_NAME19}<br/>
        Total cases: ${feature.properties.cvCases.toString()}<br/>
        </Popup>`
        
        layer.bindPopup(popupContent)
        layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight
        });
    }

    componentDidMount() {
        this.getServerUpdate('wa')
    }

    render() {
        if(this.props.displaystate) {
            if (this.state.updated) {
                return (
                    <TopoJSON
                    data = {this.state.map}
                    style = {(feature) => {
                        // console.log(feature)
                        return {
                            color: this.props.colour(feature.properties.cvCases),
                            opacity: 0.5,
                            fillColor: this.props.colour(feature.properties.cvCases),
                            weight: 1,
                            fillOpacity: 0.3
                        }
                    }}
                    onEachFeature = {this.onEachFeature}
                    />
                )
            } else {
                return (
                    <Control position="topleft" >
                        <div className="loadinginfo">Loading in map and case data for Western Australia</div>
                    </Control>
                )
            }
        } else {
            return null
        }
    }
}

export default WA