import React from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import LanguageIcon from '@material-ui/icons/Language';

const langOptions = [
    { label: 'English', value: 'en' },
    { label: 'Russian', value: 'ru' },
];

// const styles = theme => ({
//     btnIcon: {
//       marginRight: '10px',
//     },    
//   });

class LanguageSelector extends React.Component {
    state = {
        anchorEl: null,
        selectedIndex: 0
    }

    handleClickLangBtn = event => {
        this.setState({
            anchorEl: event.currentTarget
        });
    };

    handleMenuItemClick = (event, index) => {
        this.props.onLangSelect(langOptions[index].value);
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
        // const { classes, theme } = this.props;
        const { anchorEl } = this.state;

        return ( 
            <span>
            <Button onClick={this.handleClickLangBtn}>
                <LanguageIcon /> { langOptions[this.state.selectedIndex].value }
            </Button>
            <Menu  
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={this.handleClose} >
                {langOptions.map((option, index) => (
                    <MenuItem
                        key={option.label}
                        selected={index === this.state.selectedIndex}
                        onClick={event => this.handleMenuItemClick(event, index)}>
                        {option.label}
                    </MenuItem>
                ))}
                </Menu>
        </span>
        )
    }
}
export default LanguageSelector;