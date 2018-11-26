import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { withStyles } from '@material-ui/core/styles';

const cities = [
    { label: 'Kyiv', key: 'kyiv' },
    { label: 'London', key: 'london' },
    { label: 'Stockholm', key: 'stockholm' }
];

const styles = {
    option: styles => ({ ...styles, backgroundColor: '#e8dcd5' })
};

class CitySelector extends React.Component {
    state = {
        selectedOption: cities[1],
    };

    handleChange = value => {
        this.props.onChange(value);
        this.setState({
            selectedCity: value,
        });
    };

    render() {
        return (
            <Select
                options={cities}
                placeholder="Your city name"
                value={this.state.selectedCity}
                onChange={this.handleChange}
            />
        )
    }
}
CitySelector.propTypes = {
    classes: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
};
export default withStyles(styles, { withTheme: true })(CitySelector);