import React from 'react';
import UI from './UI';
import { LocaleContext } from "./i18n/LocaleContext";
import { langNameMap } from "./i18n/locales";
import { t_id } from './lib/answer'

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
    this.centerCurrentCountry = this.centerCurrentCountry.bind(this);

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

    this.setState((state) => ({
      places: [...state.places, counr_name]
    }));
    this.setState({
      angle: {
        lng: (this.state.countries[countr].bbox[0] + this.state.countries[countr].bbox[2]) / 2,
        lat: (this.state.countries[countr].bbox[1] + this.state.countries[countr].bbox[3]) / 2
      }
    });
    if (counr_name === 'Russia') {
      this.setState({ angle: { lng: 97, lat: 64 } });
    }

    if (this.state.rand_country === countr) {
      this.setState({ win: true });
      this.setState((state) => ({
        graphicData:
          {
            ...state.graphicData,
            [counr_name]: 'rgba( 0, 255, 0, 1)'
          }
      }));
      return "";
    }

    //console.log(this.state.countries[this.state.rand_country].properties.ADMIN);
    this.setState((state) => ({
      graphicData:
        {
          ...state.graphicData,
          [counr_name]: this.getDistanceBetweenCountry(this.state.rand_country, place)
        }
    }));

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

  centerCurrentCountry() {
    const country_id = this.state.rand_country;
    const country = this.state.countries[country_id];

    this.setState({
      angle: {
        lng: (country.bbox[0] + country.bbox[2]) / 2,
        lat: (country.bbox[1] + country.bbox[3]) / 2
      }
    });
  }

  render() {
    // #region DEBUG ONLY
    // const { countries, rand_country } = this.state
    // if (Array.isArray(countries) && countries[rand_country]) {
    //   console.log(countries[rand_country].properties.ADMIN)
    // }
    // #endregion

    return (
      <div>
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
            onGlobeStatisticClose={this.centerCurrentCountry}
          />
        </div>
        <section className="bg-half" style={{textAlign: '-webkit-center', position: 'relative'}}>
            <div className="container mt-5">
                <div className="row justify-content-center">
                    <div className="col-lg-8 col-md-8 text-center">
                        <div>
                            <h1 className="globle-h1">Globle Game</h1>
                            <h2 className="globle-h2">Globle will test your knowledge of geography. You must find the Unknown Country on the world map. Just like in the game Hot and Cold, the temperature will show you how close you are to the correct guess. After each of your attempts, you will see on the map the country you have chosen. The hotter the color, the closer you are to the Unknown Land. You have unlimited guesses so use the color hints and find the target country as soon as possible.</h2>
                        </div>
                    </div>
                </div>
            </div> 
        </section>
        <section className="bg-half" style={{textAlign: '-webkit-center', position: 'relative'}}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6 col-md-9">
                        <div className="section-title" style={{ textAlign: 'left' }}>
                            <h3 className="globle_head mb-4" style={{ textAlign: 'center', fontWeight: '600', fontSize: '26px' }}>How to play Globle?</h3>
                            <div className="globle_step" style={{ display: 'flex' }}>
                              <div className="number">1</div>
                              <p className="globle_text" style={{ marginLeft: '24px' }}>Touch the globe icon to start playing. You will see a world map on your screen with no countries marked. Write your first guess in the box above the globe, then click the Submit button.</p>
                            </div>
                            <div className="globle_step" style={{ display: 'flex' }}>
                              <div className="number">2</div>
                              <p className="globle_text" style={{ marginLeft: '24px' }}>After submitting, you will see the outline of the selected country. The color will show you how close you are to the target country. If you see orange or red, well, you're pretty close. Pale color means that the target country is far from your choice.</p>
                            </div>
                            <div className="globle_step" style={{ display: 'flex' }}>
                              <div className="number">3</div>
                              <p className="globle_text" style={{ marginLeft: '24px' }}>Click, drag and move the globe to get a closer view of the map.</p>
                            </div>
                            <div className="globle_step" style={{ display: 'flex' }}>
                              <div className="number">4</div>
                              <p className="globle_text" style={{ marginLeft: '24px' }}>When you select the correct country, it will be colored in dark red.</p>
                            </div>
                            <div className="globle_step" style={{ display: 'flex' }}>
                              <div className="number">5</div>
                              <p className="globle_text" style={{ marginLeft: '24px' }}>In this game, your number of guesses is unlimited, so play with pleasure and improve your geographical skills!</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <section className="share_s mt-3" style={{position: 'relative'}}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 text-center">
                        <div className="section-title" style={{ textAlign: 'center' }}>
                            <h4 className="title mb-4">Did you like Globle Game?</h4>
                            <p className="para-desc" style={{ fontSize: '18px', margin: 'auto' }}>Globle is another version of the famous Wordle puzzle. The difference between Globle is that it focuses on countries and their location on the world map. Globle is an interesting geography guessing game in which a new mysterious country is discovered every day. It bears some resemblance to the game Hot and Cold. The closer you are to the correct guess, the hotter the color. The further you are from a guess, the colder it is. Globle  is now played by over a million people daily. Globle is a great way to get some new knowledge of the world, even for geographic geniuses!</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
      </div>
    )
  };

}

export default App;
