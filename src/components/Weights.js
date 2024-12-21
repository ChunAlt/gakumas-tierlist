import React from 'react';
import NumericInput from 'react-numeric-input';
import VoiceIcon from '../icons/utx_ico_obtain_00.png';
import DanceIcon from '../icons/utx_ico_obtain_01.png';
import VisualIcon from '../icons/utx_ico_obtain_02.png';
import { lsTest } from '../utils';

function defaultProState() {
    return {
        version: 26,
        currentState: "voice",
        show: false,
        general: {
            idolStats: [80, 80, 80],
            idolMult: [15, 15, 15],
            memStats: [20, 20, 20],
            memMult: [5, 5, 5],
            memPoints: 0,
            statCap: 1800,
            vocalLessons: [780, 3, 2, 0],
            danceLessons: [775, 3, 2, 0], 
            visualLessons: [325, 0, 0, 0],
            spRate: 5,
            rest: 2,
            gift: 2,
            date: 2,
            shop: 2,
            classroom: 4,
            classroomStats: [110, 100, 80],
            drink: 10,
            upgrade: [5,5],
            cardAcq: [5, 5, 5],
            removal: 5,
        },
        voice: {
            type: 0,
        },
        dance: {
            type: 1,
        },
        visual: {
            type: 2,
        },
    }
}

function defaultMasterState() {
    return {
        version: 18,
        currentState: "voice",
        show: false,
        general: {
            idolStats: [60, 60, 60],
            idolMult: [15, 15, 15],
            memStats: [10, 10, 10],
            memMult: [5, 5, 5],
            memPoints: 0,
            statCap: 1800,
            vocalLessons: [635, 3, 2, 0],
            danceLessons: [605, 2, 2, 0],
            visualLessons: [460, 2, 0, 1],
            spRate: 0.05,
            rest: 3,
            gift: 2,
            date: 2,
            shop: 2,
            classroom: 3,
            classroomStats: [110, 100, 80],
            drink: 3,
            upgrade: [3, 4],
            cardAcq: [6, 9, 4],
            removal: 2,
        },
        voice: {
            type: 0,
        },
        dance: {
            type: 1,
        },
        visual: {
            type: 2,
        },
    }
}


class Weights extends React.Component {
    constructor(props) {
        super(props);
        
        this.onSettingChanged = this.onSettingChanged.bind(this);
        this.onGeneralSettingChanged = this.onGeneralSettingChanged.bind(this);
        this.onTypeChanged = this.onTypeChanged.bind(this);
        this.onCapChanged = this.onCapChanged.bind(this);
        this.onMinimumChanged = this.onMinimumChanged.bind(this);
        this.onToggleWeights = this.onToggleWeights.bind(this);
        this.handleStatCapChange = this.handleStatCapChange.bind(this);
        this.onMotivationChanged = this.onMotivationChanged.bind(this);
        this.onProReset = this.onProReset.bind(this);
        this.onMasterReset = this.onMasterReset.bind(this);

        this.state = defaultProState();
        this.props.onChange(this.state[this.state.currentState], this.state.general);
    }

    componentDidUpdate(prevProps, prevState) {
        if(prevState && prevState !== this.state && lsTest()) {
            window.localStorage.setItem("weights", JSON.stringify(this.state));
        }
    }

    onProReset() {
        let newState = defaultProState();
        this.setState(newState);
        this.props.onChange(newState[newState.currentState], newState.general);
    }

    onMasterReset() {
        let newState = defaultMasterState();
        this.setState(newState);
        this.props.onChange(newState[newState.currentState], newState.general);
    }

    onSettingChanged(event, numberString, numberInput) {
        if (!event) return;

        let settings = this.state[this.state.currentState];

        if (typeof event === "number") {
            if (numberInput.id.indexOf('.') > 0) {
                let split = numberInput.id.split('.');
                settings[split[0]][split[1]] = event;
            } else {
                settings[numberInput.id] = event;
            }
        }
        else {
            settings[event.target.id] = !settings[event.target.id];
        }

        let newSettings = {};
        newSettings[this.state.currentState] = settings;
        this.setState(newSettings);

        this.props.onChange(settings, this.state.general);
    }

    onGeneralSettingChanged(event, numberString, numberInput) {
        if (event === 0) { }
        else if (!event) return;

        let settings = this.state.general;

        if (typeof event === "number") {
            if (numberInput.id.indexOf('.') > 0) {
                let split = numberInput.id.split('.');
                settings[split[0]][split[1]] = event;
            } else {
                settings[numberInput.id] = event;
            }
        }
        else {
            settings[event.target.id] = !settings[event.target.id];
        }

        let newSettings = {};
        newSettings.general = settings;
        this.setState(newSettings);

        this.props.onChange(this.state[this.state.currentState], settings);
    }

    onMotivationChanged(event) {
        let settings = this.state.general;
        settings.motivation = event.target.value;
        let newSettings = {};
        newSettings.general = settings;
        this.setState(newSettings);
        this.props.onChange(this.state[this.state.currentState], settings);
    }

    onTypeChanged(event) {
        this.setState({
            currentState: event.target.id
        });

        this.props.onChange(this.state[event.target.id], this.state.general);
    }
    
    onCapChanged(event) {
        let settings = this.state[this.state.currentState];
        settings.cap = event.target.value;
        let newSettings = {};
        newSettings[this.state.currentState] = settings;
        this.setState(newSettings);
        this.props.onChange(settings, this.state.general);
    }

    onMinimumChanged(event) {
        let settings = this.state[this.state.currentState];
        settings.minimum = event.target.value;
        let newSettings = {};
        newSettings[this.state.currentState] = settings;
        this.setState(newSettings);
        this.props.onChange(settings, this.state.general);
    }

    onToggleWeights(event) {
        this.setState({show: !this.state.show});
    }

    handleStatCapChange(value) {
        this.setState((prevState) => ({
            general: {
                ...prevState.general,
                statCap: value,
            },
        }));
    }
    
    render() {
        return (
            <div className="weights">
                <div className="weight-row">
                    <input id="voice" type="image" className={this.state.currentState == "voice" ? "image-btn selected" : "image-btn"} src={VoiceIcon} onClick={this.onTypeChanged} alt="Voice" />
                    <input id="dance" type="image" className={this.state.currentState == "dance" ? "image-btn selected" : "image-btn"} src={DanceIcon} onClick={this.onTypeChanged} alt="Dance" />
                    <input id="visual" type="image" className={this.state.currentState == "visual" ? "image-btn selected" : "image-btn"} src={VisualIcon} onClick={this.onTypeChanged} alt="Visual" />
                </div>
                <div className="weight-row">
                    <button id="weights-toggle" type="button" onClick={this.onToggleWeights}>{this.state.show ? "Customize Settings" : "Hide Settings"}</button>
                </div>
                {
                    !this.state.show &&
                    <>
                        <div className="radio-container">
                            <div className="section-header">
                                Stat Cap
                            </div>
                            <div className="radio-label">
                                <label> 
                                    1500 (Pro)
                                    <input
                                        type="radio"
                                        value="1500"
                                        checked={this.state.general.statCap === 1500}
                                        onChange={() => this.handleStatCapChange(1500)}
                                    />
                                </label>
                                <label> 
                                    1800 (Master)
                                    <input
                                        type="radio"
                                        value="1800"
                                        checked={this.state.general.statCap === 1800}
                                        onChange={() => this.handleStatCapChange(1800)}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="starting-stats-container">
                            <div className="starting-stats left">
                                <div className="section-header">Idol Stats</div>
                                <div className="section-subheader">
                                    Starting stats
                                </div>

                                <label for="idolstats.0">Voice</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolStats.0" value={this.state.general.idolStats[0]} min={0} max={1000} step={5} />
                                <label for="idolstats.1">Dance</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolStats.1" value={this.state.general.idolStats[1]} min={0} max={1000} step={5} />
                                <label for="idolstats.2">Visual</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolStats.2" value={this.state.general.idolStats[2]} min={0} max={1000} step={5} />

                                <div className="section-subheader">
                                    Multiplier
                                </div>

                                <label for="idolMult.0">Voice</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolMult.0" value={this.state.general.idolMult[0]} min={0} max={100} step={1} />%
                                <label for="idolMult.1">Dance</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolMult.1" value={this.state.general.idolMult[1]} min={0} max={100} step={1} />%
                                <label for="idolMult.2">Visual</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="idolMult.2" value={this.state.general.idolMult[2]} min={0} max={100} step={1} />%

                                
                            </div>


                            <div className="starting-stats right">
                                <div className="section-header">Memory Stats</div>
                                <div className="section-subheader">
                                    Flat Stats
                                </div>

                                <label for="memStats.0">Voice</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memStats.0" value={this.state.general.memStats[0]} min={0} max={200} step={5} />
                                <label for="memStats.1">Dance</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memStats.1" value={this.state.general.memStats[1]} min={0} max={200} step={5} />
                                <label for="memStats.2">Visual</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memStats.2" value={this.state.general.memStats[2]} min={0} max={200} step={5} />
                                <br />
                                <div className="section-subheader">
                                    Multiplier
                                </div>
                                <label for="memMult.0">Voice</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memMult.0" value={this.state.general.memMult[0]} min={0} max={100} step={1} />%
                                <label for="memMult.1">Dance</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memMult.1" value={this.state.general.memMult[1]} min={0} max={100} step={1} />%
                                <label for="memMult.2">Visual</label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memMult.2" value={this.state.general.memMult[2]} min={0} max={100} step={1} />%

                                <div className="section-subheader">
                                    P Points
                                </div>

                                <label for="memPoints"></label>
                                <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="memPoints" value={this.state.general.memPoints} min={0} max={200} step={10} />
                            </div>
                        </div>
                        <br />
                        <div className="weight-row">
                            <div className="section-header">SP Lesson Base Rate</div>
                            <div className="section-explanation">
                                Your idol's base rate for SP Lessons <br />
                                (i.e. <b>0%</b> at Training Lvl 0-1, <b>5%</b> at Training Lvl 2-5, and <b>10%</b> at Training Lvl 6)
                            </div>
                            <label for="spRate">SP Rate</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="spRate" value={this.state.general.spRate} min={0} max={10} step={5} />%
                        </div>
                        <br />
                        <div className="weight-row">
                            <div className="section-header">Routing</div>
                            <div className="section-explanation">
                                Note: There should only be 6 days of Gift/Date/Consult and 4 days of Classroom in Master Mode
                            </div>

                            <label for="gift">Gift</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="gift" value={this.state.general.gift} min={0} max={14} step={1} />
                            <label for="date">Date</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="date" value={this.state.general.date} min={0} max={14} step={1} />
                            <label for="shop">Consult</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="shop" value={this.state.general.shop} min={0} max={14} step={1} />
                            <label for="classroom">Classroom</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="classroom" value={this.state.general.classroom} min={0} max={14} step={1} />
                            <label for="rest">Rest</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="rest" value={this.state.general.rest} min={0} max={14} step={1} />
                        </div>
                        <br />
                        <div className="weight-row">
                            <div className="section-header">Classroom Stats</div>
                            <div className="section-explanation">
                                Stats gained from Classrooms
                            </div>
                            <label for="classroomStats.0">Voice</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="classroomStats.0" value={this.state.general.classroomStats[0]} min={0} max={1000} step={1} />
                            <label for="classroomStats.1">Dance</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="classroomStats.1" value={this.state.general.classroomStats[1]} min={0} max={1000} step={1} />
                            <label for="classroomStats.2">Visual</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="classroomStats.2" value={this.state.general.classroomStats[2]} min={0} max={1000} step={1} />
                        </div>
                        <br />
                        <div className="weight-row">
                            <div className="section-header">Lesson Parameters</div>
                            <div className="section-explanation">
                                Note: 'Lessons' is the sum of SP, Normal, and Oikomi lessons<br />
                                The 4 Master Mode Lessons have a base stat  gain of <b>90, 170, 200,</b> then <b>220.</b> 
                            </div>
                            <div className="section-subheader">
                                Vocal Lessons
                            </div>
                            <label for="vocalLessons.0">Stats</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="vocalLessons.0" value={this.state.general.vocalLessons[0]} min={0} max={1800} step={1} />
                            <label for="vocalLessons.1">Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="vocalLessons.1" value={this.state.general.vocalLessons[1]} min={0} max={20} step={1} />
                            <label for="vocalLessons.2">SP Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="vocalLessons.2" value={this.state.general.vocalLessons[2]} min={0} max={20} step={1} />
                            <label for="vocalLessons.3">Normal Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="vocalLessons.3" value={this.state.general.vocalLessons[3]} min={0} max={20} step={1} />
    
                            <div className="section-subheader">
                                Dance Lessons
                            </div>
                            <label for="danceLessons.0">Stats</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="danceLessons.0" value={this.state.general.danceLessons[0]} min={0} max={1800} step={1} />
                            <label for="danceLessons.1">Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="danceLessons.1" value={this.state.general.danceLessons[1]} min={0} max={20} step={1} />
                            <label for="danceLessons.2">SP Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="danceLessons.2" value={this.state.general.danceLessons[2]} min={0} max={20} step={1} />
                            <label for="danceLessons.3">Normal Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="danceLessons.3" value={this.state.general.danceLessons[3]} min={0} max={20} step={1} />

                            <div className="section-subheader">
                                Visual Lessons
                            </div>
                            <label for="visualLessons.0">Stats</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="visualLessons.0" value={this.state.general.visualLessons[0]} min={0} max={1800} step={1} />
                            <label for="visualLessons.1">Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="visualLessons.1" value={this.state.general.visualLessons[1]} min={0} max={20} step={1} />
                            <label for="visualLessons.2">SP Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="visualLessons.2" value={this.state.general.visualLessons[2]} min={0} max={20} step={1} />
                            <label for="visualLessons.3">Normal Lessons</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="visualLessons.3" value={this.state.general.visualLessons[3]} min={0} max={20} step={1} />
                        </div>
                        <br />
                        <div className="weight-row">
                            <div className="section-header">Run Variables</div>
                            <div className="section-explanation">
                                Values that depend on the run<br />
                                (Support card events and Produce Items currently not supported, use Starting or Classroom Stats if needed)
                            </div>
                            <div className="section-subheader">
                                Card Acquisition
                            </div>
                            <label for="cardAcq.0">Active</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.0" value={this.state.general.cardAcq[0]} min={0} max={50} step={1} />
                            <label for="cardAcq.1">Mental</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.1" value={this.state.general.cardAcq[1]} min={0} max={50} step={1} />
                            <label for="cardAcq.2">Condition</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="cardAcq.2" value={this.state.general.cardAcq[2]} min={0} max={50} step={1} />

                            <div className="section-subheader">
                                Card Upgrades
                            </div>
                            <label for="upgrade.0">Active</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="upgrade.0" value={this.state.general.upgrade[0]} min={0} max={50} step={1} />
                            <label for="upgrade.1">Mental</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="upgrade.1" value={this.state.general.upgrade[1]} min={0} max={50} step={1} />

                            <div className="section-subheader">
                                Other
                            </div>
                            <label for="removal">Card Removal</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="removal" value={this.state.general.removal} min={0} max={50} step={1} />
                            <label for="drink">P Drinks</label>
                            <NumericInput onChange={this.onGeneralSettingChanged} type="number" id="drink" value={this.state.general.drink} min={0} max={50} step={1} />
                        </div>    
                        <br />


                    </>
                }
            </div>

        );
    }
}

export default Weights;