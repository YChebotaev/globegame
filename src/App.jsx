import React from 'react';
import UI from './UI';
import { LocaleContext } from "./i18n/LocaleContext";
import { langNameMap } from "./i18n/locales";
import {t_id} from './lib/answer'

const alternateNames = require('./data/alternate_names.json');

class App extends React.Component {

  static contextType = LocaleContext

  constructor(props) {
    super(props);

    this.state = {
      countries: { features: [] },
      angle: { lat: 60, lng: 60, altitude: 2.5 },
      rand_country: t_id,
      graphicData: {},
      today: new Date().toLocaleDateString("en-CA"),
      win: false,
      places: []
    }

    this.addPlace = this.addPlace.bind(this);
    this.setPlaces = this.setPlaces.bind(this);
    this.setWin = this.setWin.bind(this);
    this.setRandCountry = this.setRandCountry.bind(this);
    this.getCountries = this.getCountries.bind(this);

    //document.documentElement.classList.add('dark');
  }

  dateDiffInDays(day1, day2) {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const a = new Date(day1);
    const b = new Date(day2);
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());
    const diff = Math.floor((utc2 - utc1) / MS_PER_DAY);
    return diff;
  }

  getCountries(cs) {
    const practic = localStorage.getItem('isPractice')
      ? localStorage.getItem('isPractice') === 'true' ? true : false
      : true;

    let type = "r_country";

    if (practic) {
      type = "pr_country";
    }

    if (localStorage.getItem(type)) {
      this.setState({ rand_country: parseInt(localStorage.getItem(type)) });
    } else {
      localStorage.setItem(type, this.state.rand_country)
    }

    this.setState({ countries: cs.features });
  }

  addPlace(place) {

    var countr = this.getFromName(place.toLowerCase());
    if (!place || (!countr && countr !== 0)) {
      return "Game5";
    }

    var counr_name = this.state.countries[countr].properties.ADMIN;

    if (this.state.places.includes(counr_name)) {
      return "Game6";
    }

    this.setState((state) => { return {places: [...state.places, counr_name] }});
    this.setState({ angle: { lng: (this.state.countries[countr].bbox[0] + this.state.countries[countr].bbox[2]) / 2, lat: (this.state.countries[countr].bbox[1] + this.state.countries[countr].bbox[3]) / 2} });
    if (counr_name === 'Russia') {
      this.setState({ angle: { lng: 97, lat: 64 } });
    }

    if (this.state.rand_country === countr) {
      this.setState({ win: true });
      this.setState((state) =>{ return { graphicData: {...state.graphicData, [counr_name]: 'rgba( 0, 255, 0, 1)'} } });
      return "";
    }

    //console.log(this.state.countries[this.state.rand_country].properties.ADMIN);
    this.setState((state) =>{ return { graphicData: {...state.graphicData, [counr_name]: this.getDistanceBetweenCountry(this.state.rand_country, place)} } });

    if (this.state.places.length === 0) {
      return "Game4";
    }

    return "";
  }

  msToHMS(ms) {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / 1000 / 60) % 60);
    const hours = Math.floor((ms / 1000 / 3600) % 24)
    return this.twoDig(hours) + ":" + this.twoDig(minutes) + ":" + this.twoDig(seconds);
  }

  twoDig(n) {
    return (n < 10 ? '0' : '') + n;
  }

  getFromName(name) {

    const trimmedName = name
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/^st\s/g, "st. ");

    const oldNamePair = alternateNames[this.context.locale].find((pair) => {
      return pair.alternative === trimmedName;
    });

    if (oldNamePair) {
      name =  oldNamePair.real;
    }

    const langName = langNameMap[this.context.locale];

    for (var i = 0; i < this.state.countries.length; i++) {

      const { ADMIN, NAME, NAME_LONG, ABBREV, BRK_NAME, NAME_SORT, ISO_A3 } = this.state.countries[i].properties;

      if (ADMIN?.toLowerCase() === name ||
       ISO_A3?.toLowerCase() === name ||
       NAME?.toLowerCase() === name ||
       NAME_LONG?.toLowerCase() === name ||
       BRK_NAME?.toLowerCase() === name ||
       ABBREV?.toLowerCase() === name ||
       NAME_SORT?.toLowerCase() === name ||
       ABBREV.replace(/\./g, "")?.toLowerCase() === name ||
       NAME.replace(/-/g, " ")?.toLowerCase() === name ||
       this.state.countries[i].properties[langName]?.toLowerCase() === name
       ) {
        return i;
      }
    }
  }

  getDistanceBetweenCountry(c1, c2_name) {

    var c2 = this.getFromName(c2_name.toLowerCase());

    var ps1 = this.getPoints(c1);
    var ps2 = this.getPoints(c2);

    return this.getMin(ps1, ps2);

  }

  getPoints(country_id) {
    var country = this.state.countries[country_id];
    if (country.geometry.type === "Polygon") {
      return country.geometry.coordinates[0];
    }
    if (country.geometry.type === "MultiPolygon") {
      var points = [];
      for (var p of country.geometry.coordinates) {
        points = points.concat(p[0]);
      }
      return points;
    }
  }

  getMin(s1, s2) {
    var distance = 20000;
    for (var p1 of s1) {
      for (var p2 of s2) {
        distance = Math.min(distance, this.getDistanceFromLatLonInKm(p1[0], p1[1], p2[0], p2[1]));
      }
    }
    return distance;
  }

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371;
    var dLat = this.deg2rad(lat2 - lat1);
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }

  setPlaces(places) {
    var answ = "Game3";
    if (places.length >= 1) {
      answ = "Game4";
    }
    this.setState({places: []}, ()=> {
      for (var pl of places) {
        this.addPlace(pl);
      }
    });
    return answ;
  }

  setWin(win2) {
    this.setState({win: win2});
  }

  setRandCountry(rc) {
    this.setState({rand_country: rc});
  }

  render() {
    return (
      <div>
        <UI
          graphicData={this.state.graphicData}
          angle={this.state.angle}
          getCountries={this.getCountries}
          places={this.state.places}
          addPlace={this.addPlace}
          setPlaces={this.setPlaces}
          win={this.state.win}
          setWin={this.setWin}
          setRandCountry={this.setRandCountry}
          rand_country={this.state.rand_country}
        />
      </div>
    )
  };

}

export default App;
