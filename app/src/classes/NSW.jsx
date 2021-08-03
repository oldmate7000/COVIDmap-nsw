const React = require('react')
import Control from 'react-leaflet-control';
import baseStateComponent from './baseStateComponent'
import TopoJSON from './TopoJSON';

class NSW extends baseStateComponent {
    constructor(props) {
        super(props)
        this.state = {
            updated: false,
            map: {},
            displayActive: true
        }
        this.getCOVIDNumbers = this.getCOVIDNumbers.bind(this)
        this.onEachFeature = this.onEachFeature.bind(this)
    }

    getCOVIDNumbers() {
        this.COVIDFromServer('nsw').then((data) => {
            // console.log(data)
            this.props.setMax('nsw', data)

            let geos = this.state.map
            // console.log(geos)
            geos.objects.LGA_2019_AUST.geometries.forEach(area => {
                if(data[area.properties.LGA_CODE19]) {
                    area.properties['cvCases'] = data[area.properties.LGA_CODE19]
                } else {
                    area.properties['cvCases'] = {total:0, active:0}
                }
            })

            this.setState({
                updated: true,
                map: geos,
            })
        })
    }

    componentDidMount() {
        this.getServerUpdate('nsw')
    }

    onEachFeature(feature, layer){
        let popupContent = ``
        if (this.state.displayActive===true){
            popupContent = 
            `<Popup>
            LGA Name: ${feature.properties.LGA_NAME19}<br/>
            Active Cases: ${feature.properties.cvCases.active.toString()}<br/>
            </Popup>`
        } else if (this.state.displayActive===false){
            popupContent = 
            `<Popup>
            LGA Name: ${feature.properties.LGA_NAME19}<br/>
            Total cases: ${feature.properties.cvCases.total.toString()}<br/>
            </Popup>`
        }
        layer.bindPopup(popupContent)
        layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight
        });
    }

    render() {
        if(this.props.displaystate) {
            if (this.state.updated) {
                return (
                    <div>
                        <TopoJSON
                            data = {this.state.map}
                            style = {(feature) => {
                                // console.log(feature)
                                return {
                                    color: this.props.colour(feature.properties.cvCases.active),
                                    opacity: 0.5,
                                    fillColor: this.props.colour(feature.properties.cvCases.active),
                                    weight: 1,
                                    fillOpacity: 0.3
                                }
                            }}
                            onEachFeature = {this.onEachFeature}
                        />
                        <Control position='bottomright'>
                            <div className="buttons">
                                <button className='button is-small is-fullwidth' onClick={this.switchdisplay} value='nsw'>Toggle NSW active</button>
                            </div>
                        </Control>
                    </div>
                )
            } else {
                return (
                    <Control position="topleft" >
                        <div className="loadinginfo">Loading in map and case data for New South Wales</div>
                    </Control>
                )
            }
        } else {
            return null
        }
        
    }
}

export default NSW