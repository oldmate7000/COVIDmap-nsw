const React = require('react')
const ReactDOM = require('react-dom');
const ReactLeaflet = require('react-leaflet')
const { Map: LeafletMap, TileLayer } = ReactLeaflet
import Control from 'react-leaflet-control';
import ReactSlider from 'react-slider'

const scale = require('d3-scale')
const colourscale = require ('d3-scale-chromatic')


// import WA from './classes/WA'
// import QLD from './classes/QLD'
// import VIC from './classes/VIC'
import NSW from './classes/NSW'

import './style.css';
import turboscale from './assets/turboscale.png'

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            lat: -33.83420513593713,
            lng: 151.14646911621097,
            zoom: 11,
            dispMaxes: {
                'vic': 0,
                'nsw': 0,
                'wa': 0,
                'qld': 0
            },
            suppMaxes: {},
            maxCases: 0,
        }
        this.setMax = this.setMax.bind(this)
        this.moveend = this.moveend.bind(this)
        this.switchdisplay = this.switchdisplay.bind(this)
        this.switchMax = this.switchMax.bind(this)
    }

    switchMax(stateName) {
        let suppMaxes = this.state.suppMaxes
        let dispMaxes = this.state.dispMaxes

        if (Object.keys(dispMaxes).includes(stateName)) {
            // console.log(dispMaxes[stateName])
            suppMaxes[stateName] = dispMaxes[stateName]
            delete dispMaxes[stateName]
        } else if (Object.keys(suppMaxes).includes(stateName)) {
            dispMaxes[stateName] = suppMaxes[stateName]
            delete suppMaxes[stateName]
        }

        let newMaxCases = 0
        Object.keys(dispMaxes).forEach((key) => {
            if (dispMaxes[key] > newMaxCases) newMaxCases = dispMaxes[key]
        })

        this.setState({
            'suppMaxes': suppMaxes,
            'dispMaxes': dispMaxes,
            'maxCases': newMaxCases
        })
    }
    
    setMax(stateName, data) {
        let currentMax = this.state.maxCases
        let stateMax = 0

        console.log(data)
        // console.log(stateName)
        
        for (const x in data) {
            if((typeof data[x])==='number'){
                if(data[x] > stateMax) {
                    stateMax = data[x]
                }
            } else if ((typeof data[x])==='object' && data[x]!=null) {
                if(data[x].active > stateMax) {
                    stateMax = data[x].active
                }
            }
        }

        if (stateMax > currentMax) {
            currentMax = stateMax
        }

        this.setState(function(state) {
            return {
                dispMaxes: {...state.dispMaxes, [stateName]: stateMax},
                maxCases: currentMax
            }
        })
    }

    moveend(e) {
        this.setState({
            lat: e.target.getCenter().lat,
            lng: e.target.getCenter().lng,
            zoom: e.target.getZoom()
        })
    }

    switchdisplay(e) {
        let stateName = e.target.value
        this.switchMax(stateName)
    }

    render() {
        var colour = scale.scaleSequential().domain([0, this.state.maxCases]).interpolator(colourscale.interpolateTurbo)
        return (
            <div>
                <LeafletMap
                center={[this.state.lat, this.state.lng]}
                zoom={this.state.zoom}
                onmoveend={this.moveend}
                >
                    <TileLayer
                    attribution='&copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution/" target="_blank">CARTO</a>, <a href="https://www.theguardian.com/australia-news/datablog/ng-interactive/2020/apr/15/coronavirus-australia-numbers-how-many-new-cases-today-deaths-death-toll-covid-19-stats-graph-map-by-postcode" target="_blank">The Guardian</a>'
                    url='https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png'
                    />
                    <NSW
                        colour = {colour}
                        setMax = {this.setMax}
                        displaystate  = {this.state.dispMaxes.hasOwnProperty('nsw')? true: false}
                    />
                    {/* <VIC
                        colour = {colour}
                        setMax = {this.setMax}
                        displaystate  = {this.state.dispMaxes.hasOwnProperty('vic')? true: false}
                    /> */}
                    {/* <QLD
                        colour = {colour}
                        setMax = {this.setMax}
                        displaystate  = {this.state.dispMaxes.hasOwnProperty('qld')? true: false}
                    /> */}
                    {/* <WA
                        colour = {colour}
                        setMax = {this.setMax}
                        displaystate  = {this.state.dispMaxes.hasOwnProperty('wa')? true: false}
                    /> */}
                    <Control position='bottomleft'>
                        <div id='legend'>
                            <h1 className='title'>0</h1>
                            <img src={turboscale}/>
                            <h1 className='title'>{this.state.maxCases}</h1>
                        </div>
                        
                    </Control>
                    <Control position='bottomright'>
                        <div className="buttons">
                            <div>Currently centered on <br/>{this.state.lat.toFixed(4)}<br/> {this.state.lng.toFixed(4)}<br/> and at zoom level: {this.state.zoom}</div>
                            {/* <button className='button is-small is-fullwidth' onClick={() => {this.setState({lat: -37.905741263083954, lng: 145.10879516601565, zoom: 10})}}>Snap to Melbourne</button> */}
                            <button className='button is-small is-fullwidth' onClick={() => {this.setState({lat: -33.83420513593713, lng: 151.14646911621097, zoom: 11})}}>Snap to Sydney</button>
                            {/* <button className='button is-small is-fullwidth' onClick={() => {this.setState({lat: -27.548459140257656, lng: 153.18786621093753, zoom: 9})}}>Snap to Brisbane</button> */}
                            {/* <button className='button is-small is-fullwidth' onClick={() => {this.setState({lat: -31.962939927942937, lng: 115.87348937988283, zoom: 11})}}>Snap to Perth</button> */}
                            <button className='button is-small is-fullwidth' onClick={() => {this.setState({lat: -27.5977572, lng: 134.4407826, zoom: 5})}}>Snap to Australia</button>
                            <br/>
                            <button className='button is-small is-fullwidth' onClick={this.switchdisplay} value='nsw'>Toggle NSW</button>
                            <button className='button is-small is-fullwidth' onClick={this.switchdisplay} value='nsw'>Toggle NSW active</button>
                            {/* <button className='button is-small is-fullwidth' onClick={this.switchdisplay} value='qld'>Toggle QLD</button> */}
                            {/* <button className='button is-small is-fullwidth' onClick={this.switchdisplay} value='vic'>Toggle VIC</button> */}
                            {/* <button className='button is-small is-fullwidth' onClick={this.switchdisplay} value='wa'>Toggle WA</button> */}
                        </div>
                        
                    </Control>
                </LeafletMap>
                <ReactSlider
                    className="horizontal-slider"
                    thumbClassName="slider-thumb"
                    trackClassName="slider-track"
                    defaultValue={[10, 100]}
                    ariaLabel={['Lower thumb', 'Upper thumb']}
                    ariaValuetext={state => `Thumb value ${state.valueNow}`}
                    renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                    pearling
                    minDistance={10}
                />
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));