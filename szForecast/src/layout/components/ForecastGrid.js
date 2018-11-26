import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import PropTypes from 'prop-types';

function TabContainer({ children, dir }) {
    return (
        <strong component="div" dir={dir} style={{ padding: 8 * 3 }}>
            {children}
        </strong>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
    dir: PropTypes.string.isRequired,
};

class ForecastGrid extends React.Component {
    state = {
        selectedTab: this.props.days[0].dayInYear,
    };

    handleTabChange = (event, value) => {
        this.setState({ selectedTab: value });
    };

    render() {
        return (
            <div>
                <Tabs value={this.state.selectedTab}
                    indicatorColor="primary"
                    textColor="primary"
                    fullWidth
                    onChange={this.handleTabChange}>
                    {(this.props.days.map((el) =>
                        <Tab label={el.dayOfWeek} key={el.dayInYear} value={el.dayInYear} />
                    ))}
                </Tabs>
                {(this.props.forecasts.map((day, i) =>
                    this.state.selectedTab === day.key &&
                    <TabContainer dir="x" key={day.key}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th" scope="row"></TableCell>
                                    {day.values.map((col, i) =>
                                        <TableCell component="th" scope="row">{col.time}</TableCell>
                                    )}
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell component="th" scope="row">temp</TableCell>
                                    {day.values.map(col =>
                                        <TableCell component="th" scope="row">{col.temp}</TableCell>
                                    )}
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">temp min</TableCell>
                                    {day.values.map(col =>
                                        <TableCell component="th" scope="row">{col.temp_min}</TableCell>
                                    )}
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">temp max</TableCell>
                                    {day.values.map(col =>
                                        <TableCell component="th" scope="row">{col.temp_max}</TableCell>
                                    )}
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">main</TableCell>
                                    {day.values.map(col =>
                                        <TableCell component="th" scope="row">{col.main}</TableCell>
                                    )}
                                </TableRow>
                                <TableRow>
                                    <TableCell component="th" scope="row">description</TableCell>
                                    {day.values.map(col =>
                                        <TableCell component="th" scope="row">{col.description}</TableCell>
                                    )}
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TabContainer>
                ))}
            </div>
        )
    }
}
export default ForecastGrid;