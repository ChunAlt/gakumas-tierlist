import React from 'react';
import SupportCard from './SupportCard';
import events from '../card-events';

function TierList(props) {
    let cards = props.cards;

    if(props.weights.type > -1) {
        cards = cards.filter(e => types[e.type] === props.weights.type);
    }

    let processedCards = processCards(cards, props.weights, props.selectedCards);

    if (processedCards.length === 0) {
        return <div className="tier-list"></div>;
    }

    let rows = [[]];
    let current_row = 0;
    let step = (processedCards[0].score - processedCards[processedCards.length - 1].score) / 7;
    let boundary = processedCards[0].score - step;

    for (let i = 0; i < processedCards.length; i++) {
        while (processedCards[i].score < boundary - 1) {
            rows.push([]);
            current_row++;
            boundary -= step;
        }

        rows[current_row].push((
            <SupportCard
                id={processedCards[i].id}
                lb={processedCards[i].lb}
                score={processedCards[i].score}
                key={processedCards[i].id + "LB" + processedCards[i].lb}
                info={processedCards[i].info}
                charName={processedCards[i].char_name}
                onClick={() => props.cardSelected(cards.find((c) => c.id === processedCards[i].id && c.limit_break === processedCards[i].lb))}
            />
        ));
    }

    let tiers = [];

    for (let i = 0; i < 7; i++) {
        tiers.push(
            <div className="tier" key={tierNames[i]}>
                <div className="tier-letter">{tierNames[i]}</div>
                <div className="tier-images">{rows[i]}</div>
            </div>
        )
    }

    return (
        <div className="tier-list">
            {tiers}
        </div>
    );
}

const tierNames = ['S', 'A', 'B', 'C', 'D', 'E', 'F']
const types = {
    0: 6,
    101: 0,
    102: 2,
    103: 3,
    105: 1,
    106: 4
}
const scenarioLink = [
    "ライスシャワー",
    "ハルウララ",
    "マチカネフクキタル",
    "タイキシャトル",
    "樫本理子"
]

function processCards(cards, weights, selectedCards) {
    let processedCards = [];
    selectedCards = selectedCards.slice();
    
    for (let i = 0; i < cards.length; i++) {
        let info = {};
        let card = cards[i];
        let cardType = types[card.type];
        let bondNeeded = 80 - card.starting_bond;

        // Add starting stats and stats from events
        let energyGain = 0;
        let statGains = card.starting_stats.slice();
        statGains.push(0);
        
        info.starting_stats = card.starting_stats.slice();
        info.event_stats = [0,0,0,0,0,0,0];
        
        if (events[card.id]) {
            info.event_stats = events[card.id].slice();
            for (let stat = 0; stat < 6; stat++) {
                statGains[stat] += events[card.id][stat] * card.effect_size_up;
                info.event_stats[stat] = events[card.id][stat] * card.effect_size_up;
            }
            energyGain += events[card.id][6] * card.energy_up;
            bondNeeded -= events[card.id][7];
        } else {
            // Dummy event values for cards we don't yet know the events for
            if (card.rarity === 2) {
                // 25 total
                for (let stat = 0; stat < 5; stat++) {
                    statGains[stat] += 5;
                }
            } else if (card.rarity === 3) {
                // 35 total
                for (let stat = 0; stat < 5; stat++) {
                    statGains[stat] += 7;
                }
            }
        }
        
        let daysToBond = bondNeeded / weights.bondPerDay;
        let rainbowDays = weights.trainingDays - daysToBond;
        let specialty = (100 + card.specialty_rate) * card.unique_specialty;
        let specialtyPercent = specialty / (450 + specialty);
        let otherPercent = 100 / (450 + specialty);
        let daysPerTraining = [0,0,0,0,0];
        let rainbowTraining = 0;
        
        // Calculate appearance rates on each training
        for (let stat = 0; stat < 5; stat++) {
            if (stat == cardType) {
                rainbowTraining = specialtyPercent * rainbowDays;
                daysPerTraining[stat] = specialtyPercent * daysToBond;
            } else {
                daysPerTraining[stat] = otherPercent / 4 * weights.trainingDays;
            }
        }

        // Calculate some stuff here so we don't have to do it a million times later
        for (let card = 0; card < selectedCards.length; card++) {
            let cardSpecialty = (100 + selectedCards[card].specialty_rate) * selectedCards[card].unique_specialty;
            let cardSpecialtyPercent = (cardSpecialty) / (450 + cardSpecialty)
            selectedCards[card].rainbowSpecialty = cardSpecialtyPercent;
            selectedCards[card].offSpecialty = 100 / (450 + cardSpecialty);
            selectedCards[card].cardType = types[selectedCards[card].type];
        }

        // Stats from cross-training
        info.non_rainbow_gains = [0,0,0,0,0,0,0];
        for (let training = 0; training < 5; training ++) {
            let gains = weights.trainingGain[training];
            let daysOnThisTraining = daysPerTraining[training];
            energyGain += daysOnThisTraining * gains[6] * card.energy_discount;

            let trainingGains = CalculateCrossTrainingGain(gains, weights, card, selectedCards, training, daysOnThisTraining, false);
            
            for (let stat = 0; stat < 6; stat ++) {
                statGains[stat] += trainingGains[stat];
                info.non_rainbow_gains[stat] += trainingGains[stat];
            }
            info.non_rainbow_gains[6] += (daysOnThisTraining * gains[6] * card.energy_discount);
        }

        info.rainbow_gains = [0,0,0,0,0,0,0];

        // Stats from rainbows
        if (cardType < 6) {
            energyGain += rainbowTraining * card.wisdom_recovery;
            let specialtyGains = weights.trainingGain[cardType];
            let trainingGains = CalculateTrainingGain(specialtyGains, weights, card, selectedCards, cardType, rainbowTraining, true);

            info.rainbow_gains = trainingGains.slice();
            info.rainbow_gains.push(rainbowTraining * card.wisdom_recovery);

            for (let stat = 0; stat < 6; stat ++) {
                statGains[stat] += trainingGains[stat];
            }
        }

        // Race bonus
        for (let stat = 0; stat < 5; stat ++) {
            statGains[stat] += card.race_bonus * 3 / 5;
        }
        statGains[5] += card.race_bonus * 8;

        info.race_bonus_gains = (card.race_bonus * 3 / 5) * 5 + card.race_bonus * 8;

        // Convert stat gains to score
        let score = 0;
        for (let stat = 0; stat < 6; stat ++) {
            score += Math.min(statGains[stat], weights.cap) * weights.stats[stat];
        }
        score += energyGain * weights.stats[6];

        if (scenarioLink.indexOf(card.char_name) > -1) {
            // 10 stats from the better event, 10 stats from the better explosion
            score += 20;
            info.is_scenario_link = true;
        }

        processedCards.push({
            id: card.id,
            lb: card.limit_break,
            score: score,
            info: info,
            char_name: card.char_name
        })
    }

    processedCards.sort((a, b) => b.score - a.score);
    return processedCards;
}

function CalculateTrainingGain(gains, weights, card, otherCards, trainingType, days, rainbow) {
    let trainingGains = [0,0,0,0,0,0,0];

    let trainingBonus = card.training_bonus;
    let friendshipBonus = 1;
    if (rainbow) {
        friendshipBonus = card.friendship_bonus * card.unique_friendship_bonus;
    }
    let motivationBonus = card.motivation_bonus;

    for (let stat = 0; stat < 6; stat ++) {
        if (gains[stat] === 0) continue;

        let base = gains[stat] + card.stat_bonus[stat];
        if (rainbow) {
            base += card.friendship_stats[stat];
        }
        trainingGains[stat] += (base 
            * trainingBonus
            * (1 + 0.2 * motivationBonus)
            * friendshipBonus
            * 1.05
            * weights.umaBonus[stat]
            - gains[stat])
            * days
            * CalculateCombinationChance([], otherCards, trainingType);
    }
    
    if (otherCards.length == 0) return trainingGains;

    const combinations = GetCombinations(otherCards);

    for (let i = 0; i < combinations.length; i++) {
        for (let stat = 0; stat < 6; stat ++) {
            if (gains[stat] === 0) continue;

            let combinationTrainingBonus = combinations[i].reduce((current, c) => current + c.training_bonus - 1, 1);
            let combinationFriendshipBonus = combinations[i].reduce((current, c) => {
                if (c.cardType === trainingType) {
                    return current * c.friendship_bonus * c.unique_friendship_bonus;
                } else {
                    return current;
                }
            }, 1);
            let combinationMotivationBonus = combinations[i].reduce((current, c) => current + c.motivation_bonus - 1, 1);
            let combinationStatBonus = combinations[i].reduce((current, c) => current + c.stat_bonus[stat], 0);

            let base = gains[stat] + combinationStatBonus;
            if (rainbow) {
                base += card.friendship_stats[stat];
            }

            let combinationGains = (base 
                * combinationTrainingBonus
                * (1 + 0.2 * combinationMotivationBonus)
                * combinationFriendshipBonus
                * (1.05 * combinations[i].length)
                * weights.umaBonus[stat]);
                
            let totalGains = ((base + card.stat_bonus[stat])
                * (combinationTrainingBonus + trainingBonus - 1)
                * (1 + 0.2 * (combinationMotivationBonus + motivationBonus - 1))
                * (combinationFriendshipBonus * friendshipBonus)
                * (1.05 * (combinations[i].length + 1))
                * weights.umaBonus[stat]);
            
            trainingGains[stat] += (totalGains - combinationGains) * days * CalculateCombinationChance(combinations[i], otherCards, trainingType);
        }
    }

    return trainingGains;
}

function CalculateCrossTrainingGain(gains, weights, card, otherCards, trainingType, days) {
    let trainingGains = [0,0,0,0,0,0,0];
    let statCards = otherCards.filter((c) => c.cardType === trainingType);
    let trainingBonus = card.training_bonus + card.friendship_training;
    let motivationBonus = card.motivation_bonus;
    const combinations = GetCombinations(otherCards);

    for (let i = 0; i < combinations.length; i++) {
        for (let stat = 0; stat < 6; stat ++) {
            if (gains[stat] === 0) continue;
            const combination = combinations[i];
            if(!combination.some((r) => statCards.indexOf(r) > -1)) continue;

            let combinationTrainingBonus = combination.reduce((current, c) => current + c.training_bonus - 1, 1);
            let combinationFriendshipBonus = combination.reduce((current, c) => {
                if (c.cardType === trainingType) {
                    return current * c.friendship_bonus * c.unique_friendship_bonus;
                } else {
                    return current;
                }
            }, 1);
            let combinationMotivationBonus = combination.reduce((current, c) => current + c.motivation_bonus - 1, 1);
            let combinationStatBonus = combination.reduce((current, c) => current + c.stat_bonus[stat], 0);

            const base = gains[stat] + combinationStatBonus;

            let combinationGains = (base 
                * combinationTrainingBonus
                * (1 + 0.2 * combinationMotivationBonus)
                * combinationFriendshipBonus
                * (1.05 * combination.length)
                * weights.umaBonus[stat]);
                
            let totalGains = ((base + card.stat_bonus[stat])
                * (combinationTrainingBonus + trainingBonus - 1)
                * (1 + 0.2 * (combinationMotivationBonus + motivationBonus - 1))
                * (combinationFriendshipBonus)
                * (1.05 * (combination.length + 1))
                * weights.umaBonus[stat]);
            
            trainingGains[stat] += (totalGains - combinationGains) * days * CalculateCombinationChance(combination, otherCards, trainingType);
        }
    }

    return trainingGains;
}

function GetCombinations(cards) {
    let combinations = [];
    let temp = [];
    const count = Math.pow(2, cards.length);

    for (let i = 0; i < count; i++){
        temp = [];
        for (let j = 0; j<cards.length; j++) {
            if (i & Math.pow(2,j)) { 
                temp.push(cards[j]);
            }
        }
        if (temp.length > 0) {
            combinations.push(temp);
        }
    }

    return combinations;
}

function CalculateCombinationChance(combination, cards, trainingType) {
    const otherCards = cards.filter((c) => combination.findIndex((d) => c.id == d.id) === -1);

    let chance = combination.reduce((current, card) => {
        if (card.cardType === trainingType) {
            return current * card.rainbowSpecialty;
        } else {
            return current * card.offSpecialty;
        }
    }, 1);

    chance = otherCards.reduce((current, card) => {
        if (card.cardType === trainingType) {
            return current * (1 - card.rainbowSpecialty);
        } else {
            return current * (1 - card.offSpecialty);
        }
    }, chance);

    return chance;
}

export default TierList;