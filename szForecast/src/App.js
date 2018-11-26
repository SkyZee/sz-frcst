import React, { Component } from 'react';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import axios from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';
import moment from 'moment';
import szTheme from './layout/components/SzTheme';
import Zoom from '@material-ui/core/Zoom';
import Slide from '@material-ui/core/Slide';

import './App.css';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import ForecastGrid from './layout/components/ForecastGrid';
import UnitsSelector from './layout/components/UnitsSelector';
import LanguageSelector from './layout/components/LanguageSelector';
import CitySelector from './layout/components/CitySelector';

const styles = theme => ({
  toolbarButtons: {
    marginLeft: 'auto',
  },
  pageTitle: {
      letterSpacing: '2px',
      textTransform: 'uppercase'
  },    
  contentContainer: {
    margin: '50px',
  },
  progress: {
    margin: theme.spacing.unit * 2,
  },
  mainInfo: {
    padding: '20px',
  },
  submit: {
    marginTop: '10px',
  },
  selectcity : {
    option: {
      backgroundColor: '#b57c72'
    }
  }
});

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {      
      selectedCity: "london",
      selectedLang: "en",
      selectedUnits: "metric",
      forecasts: [],
      
      country: null,
      loadedCity: null,
      temp: null,
      date: null,

      groupedForecasts: {},
      isLoading: false,
      idLoaded: false,
      days: [],
      daysOfYear: []
    };
  }

  onUnitsSelect = (val) => {
    this.setState({
      selectedUnits: val
    })
  }

  onLangSelect = (val) => {
    this.setState({
      selectedLang: val
    })
  }

  onCitySelect = (val) => {
    this.setState({
      selectedCity: val.key
    })
  }

  getForecast(city, units, lang) {
    this.setState({ isLoading: true, isLoaded: false });

    const middlewareUrl = `https://sz-mid.azurewebsites.net/api/weather/${city}?units=${units}&lang=${lang}`;
    // const middlewareUrl = `http://localhost:60985/api/weather/${city}?units=${units}&lang=${lang}`;
    axios.get(middlewareUrl)
      .then(res => {
        const weather = res.data;

        this.setState({ 
          loadedCity: weather.city,
          temp: weather.temp,
          date: moment.unix(weather.dt).format("LL"),
          country: weather.country
        });

        var forecasts = weather.forecasts;
        this.setState({ forecasts: forecasts });
        // console.log(weather.days);
        this.setState({ days: weather.days });
        this.setState({ isLoading: false });
        this.setState({ isLoaded: true });
      });
  }

  handleSubmit = event => {
    this.getForecast(this.state.selectedCity, this.state.selectedUnits, this.state.selectedLang);
  }

  render() {
    const { classes } = this.props;
    return (
      <MuiThemeProvider theme={szTheme}>
        <AppBar position="static">
          <Toolbar>
            <div className={classes.pageTitle}>
                weather forecast
            </div>
            <div className={classes.toolbarButtons}>
              <UnitsSelector onUnitsSelect={this.onUnitsSelect}></UnitsSelector>
              <LanguageSelector onLangSelect={this.onLangSelect}></LanguageSelector>
            </div>
          </Toolbar>
        </AppBar>        
        <Grid container justify="center" spacing={16} >          
            <Grid item container className={classes.contentContainer} spacing={16} justify="center">
                <Grid item container md={10} direction="row" spacing={16} justify="center">                  
                    <Grid item md={10} xs={12}>
                      <Slide direction="left" in={true} mountOnEnter unmountOnExit>
                        <div>
                          <CitySelector onChange={this.onCitySelect}></CitySelector>
                          <Button className={classes.submit} variant="contained" color="secondary" onClick={this.handleSubmit}>Get Forecast</Button>
                        </div>                      
                      </Slide>
                    </Grid>                  
                </Grid>                
                { this.state.isLoading ? 
                  <Grid item xs={12} container justify="center">
                    <Grid item xs={2} >
                      <CircularProgress className={classes.progress} size={100} />
                    </Grid>
                  </Grid> : null 
                }              
            </Grid>
          
          <Grid item md={10}  xs={12}>
          <Zoom in={this.state.isLoaded} style={{ transitionDelay: this.state.isLoaded ? 500 : 0 }}>
              <Paper className={classes.mainInfo}>
                <Typography variant="h4" gutterBottom>
                  {this.state.loadedCity}, {this.state.country}
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {this.state.date}
                </Typography>
                <Typography variant="h1" gutterBottom>
                  {this.state.temp} ℃
                </Typography>
                {this.state.isLoaded ? 
                  <ForecastGrid days={this.state.days} forecasts={this.state.forecasts} >
                  </ForecastGrid> : null
                }                        
              </Paper>
            </Zoom>
          </Grid>
        </Grid>       
      </MuiThemeProvider>
    );
  }
}

export default withStyles(styles)(App);
