import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import SettingsIcon from '@material-ui/icons/Settings';

const unitsOptions = [
    { label: 'K',  key: '', value: 'kelvin'  },
    { label: '℃', key: 'metric', value: 'celsius' },
    { label: '℉',  key: 'imperial', value: 'fahrenheit' },
];

class UnitsSelector extends React.Component {
    state = {
        anchorEl: null,
        selectedIndex: 1
    }

    handleClickUnitsBtn = event => {
        this.setState({
            anchorEl: event.currentTarget
        });
    };

    handleMenuItemClick = (event, index) => {
        this.props.onUnitsSelect(unitsOptions[index].key);
        this.setState({
            selectedIndex: index,
            anchorEl: null
        });
    };

    handleClose = () => {
        this.setState({
            anchorEl: null
        });
    };

    render() {
        // const { classes } = this.props;
        const { anchorEl } = this.state;

        return ( 
            <span>
            <Button onClick={this.handleClickUnitsBtn}>
                <SettingsIcon /> { unitsOptions[this.state.selectedIndex].label }
            </Button>
            <Menu 
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose} >
                {unitsOptions.map((option, index) => (
                    <MenuItem
                    key={option.label}
                    selected={index === this.state.selectedIndex}
                    onClick={event => this.handleMenuItemClick(event, index)}
                    >
                    {option.label}
                    </MenuItem>
            ))}
            </Menu>
        </span>
        )
    }
}
export default UnitsSelector;