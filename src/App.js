import './App.css';
import cards from './cards';
import TierList from './components/TierList';
import Weights from './components/Weights';
import SelectedCards from './components/SelectedCards';
import Filters from './components/Filters';
import React from 'react';

const ordinal = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th"];
const type_names = ["Voice", "Dance", "Visual"];

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weights: {
                idolStats: [60, 60, 60],
                idolMult: [15, 15, 15],
                memStats: [10, 10, 10],
                memMult: [5, 5, 5],
                memPoints: 0,
                statCap: 1800,
                vocalLessons: [635, 3, 2, 0],
                danceLessons: [605, 2, 2, 0],
                visualLessons: [460, 2, 0, 1],
                spRate: 5,
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

            selectedCards: [
                cards.find((c) => c.id === 30001 && c.limit_break === 0),
                cards.find((c) => c.id === 30002 && c.limit_break === 1),
                cards.find((c) => c.id === 30003 && c.limit_break === 2),
                cards.find((c) => c.id === 30004 && c.limit_break === 3),
                cards.find((c) => c.id === 30005 && c.limit_break === 4),
                cards.find((c) => c.id === 30006 && c.limit_break === 4),
            ],
            availableCards: cards,
        }

        this.onWeightsChanged = this.onWeightsChanged.bind(this);
        this.onCardSelected = this.onCardSelected.bind(this);
        this.onCardRemoved = this.onCardRemoved.bind(this);
        this.onCardsChanged = this.onCardsChanged.bind(this);
        this.onLoadPreset = this.onLoadPreset.bind(this);
    }

    onWeightsChanged(statWeights, generalWeights) {
        let combinedWeights = {...statWeights, ...generalWeights};
        this.setState({weights: combinedWeights});
    }

    onCardSelected(card) {
        if (this.state.selectedCards.length > 5) return;
        let cards = this.state.selectedCards.slice();
        let index = this.state.selectedCards.findIndex((c) => c.id === card.id);

        if (index > -1) {
            cards[index] = card;
        } else {
            cards.push(card);
        }

        this.setState({selectedCards:cards});
    }

    onCardRemoved(card) {
        if (this.state.selectedCards.length === 1) return;
        let cards = this.state.selectedCards.slice();
        let cardIndex = cards.findIndex((c) => c.id === card.id);
        cards.splice(cardIndex, 1);
        this.setState({selectedCards:cards});
    }

    onCardsChanged(cards) {
        this.setState({availableCards: cards});
    }

    onLoadPreset(presetCards) {
        let selectedCards = [];
        for(let i = 0; i < presetCards.length; i++) {
            selectedCards.push(cards.find((c) => c.id === presetCards[i] && c.limit_break === 4));
        }
        this.setState({selectedCards:selectedCards});
    }

    render() {
        return (
            <div className="App">
                <h1>Gakuen iDOLM@STER Support Card Tier List</h1>
                <span className="section-explanation">
                    This website is a fork of this <a href="https://euophrys.github.io/uma-tiers/">Uma Musume Tier List website</a>.<br />
                    This tier list only considers stats from Support Abilities. It does not consider Signature quality, Card Events, or stats from Produce Items.<br/>
                </span>
                <Weights
                    onChange={this.onWeightsChanged}
                    />
                <SelectedCards
                    selectedCards={this.state.selectedCards}
                    onClick={this.onCardRemoved}
                    onLoadPreset={this.onLoadPreset}
                    weights={this.state.weights}
                    />
                <Filters
                    onCardsChanged={this.onCardsChanged}
                    />
                <TierList 
                    cards={this.state.availableCards}
                    weights={this.state.weights}
                    selectedCards={this.state.selectedCards}
                    cardSelected={this.onCardSelected}
                />
                
            </div>
        );
    }
}

export default App;
