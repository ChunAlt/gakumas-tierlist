import React from 'react';
import VoiceIcon from '../icons/utx_ico_obtain_00.png';
import DanceIcon from '../icons/utx_ico_obtain_01.png';
import VisualIcon from '../icons/utx_ico_obtain_02.png';
import AssistIcon from '../icons/utx_ico_obtain_03.png';

const type_to_icon = [
    VoiceIcon,
    DanceIcon,
    VisualIcon,
    AssistIcon,
]

function SelectedCards(props) {
    let cards = [];
    let spRate = props.weights.spRate.slice();
    let pPoints = props.weights.memPoints;

    for (let i = 0; i < 3; i++) {
        spRate[i] += 10;
    };

    for (let i = 0; i < props.selectedCards.length; i++) {
        let lit_up = "";
        let dark = "";
        let card = props.selectedCards[i];

        if (card.type === 3) {
            spRate[0] += card.sp_r;
            spRate[1] += card.sp_r;
            spRate[2] += card.sp_r;
        } else {
            spRate[card.type] += card.sp_r;
        }
        pPoints += card.spp;

        for (let j = 0; j < 4; j++) {
            if (j < card.limit_break) {
                lit_up += "◆";
            } else {
                dark += "◆";
            }
        }

        let score = 0;
        let statGains = card.start_b;

        if (card.type === 0) {
            statGains += card.pb * props.weights.vocalLessons[0];
        } else if (card.type === 1) {
            statGains += card.pb * props.weights.danceLessons[0];
        } else {
            statGains += card.pb * props.weights.visualLessons[0];
        }

        if (card.type === 0) {
            statGains += card.lb * props.weights.vocalLessons[1];
        } else if (card.type === 1) {
            statGains += card.lb * props.weights.danceLessons[1];
        } else {
            statGains += card.lb * props.weights.visualLessons[1];
        }

        if (card.type === 0) {
            statGains += card.sp_lb * props.weights.vocalLessons[2];
        } else if (card.type === 1) {
            statGains += card.sp_lb * props.weights.danceLessons[2];
        } else {
            statGains += card.sp_lb * props.weights.visualLessons[2];
        }

        if (card.type === 0) {
            statGains += card.n_lb * props.weights.vocalLessons[3];
        } else if (card.type === 1) {
            statGains += card.n_lb * props.weights.danceLessons[3];
        } else {
            statGains += card.n_lb * props.weights.visualLessons[3];
        }

        statGains += card.rest_b * props.weights.rest;
        statGains += card.gb * props.weights.gift;
        statGains += card.db * props.weights.date;
        statGains += card.sb * props.weights.shop;
        statGains += card.cb * props.weights.classroom;
        statGains += card.pdb * props.weights.drink;
        statGains += card.mb;

        statGains += card.ub * props.weights.upgrade.reduce((total, current) => total + current, 0);
        statGains += card.m_ub * props.weights.upgrade[1];

        statGains += card.a_cb * props.weights.cardAcq[0];
        statGains += card.m_cb * props.weights.cardAcq[1];
        statGains += card.con_cb * props.weights.cardAcq[2];

        statGains += card.remove_b * props.weights.removal;

        // Convert stat gains to score
        score += Math.round(statGains);

        let sigImg1 = "";
        let sigImg2 = "";
        sigImg1 = "/signatureImages/signature_10000.png"
        sigImg2 = "/signatureImages/signature_10000.png"

        /*
        if (card.sig === 0) {
            sigImg1 = "/signatureImages/signature_10000.png"
            sigImg2 = "/signatureImages/signature_10000.png"
        }
            
        } else if (card.sig === 1) {
            sigImg1 = "/signatureImages/signature_" + card.rarity + "0000.png"
            sigImg2 = "/signatureImages/signature_" + card.id
        } else {
            sigImg1 = "/signatureImages/signature_" + card.id
            sigImg2 = "/signatureImages/signature_" + card.rarity + "1000.png"
        }
        */    

        cards.push(
            <div key={card.id} className="support-card">
                <img
                    className="support-card-image"
                    name={card.id}
                    src={process.env.PUBLIC_URL + "/cardImages/support_card_s_" + card.id + ".png"}
                    title={card.id}
                    alt={card.id}
                    onClick={() => props.onClick(card)}
                />
                <img
                    className="type-icon"
                    name="type icon"
                    src={type_to_icon[card.type]}
                    title="type"
                    alt="card type"
                    onClick={() => props.onClick(card)}
                />
                <span className="limit-breaks">
                    <span className="lb-yes">{lit_up}</span>
                    <span className="lb-no">{dark}</span>
                </span>
                <img
                    className="signature-icon"
                    name={card.id}
                    src={process.env.PUBLIC_URL + sigImg1}
                    title={card.id}
                    alt={card.id}
                />
                <img
                    className="signature-icon"
                    name={card.id}
                    src={process.env.PUBLIC_URL + sigImg2}
                    title={card.id}
                    alt={card.id}
                />
                <span className="score">
                    {score}
                </span>
            </div>
        );

    }

    let noSP = [(100 - spRate[0]) / 100, (100 - spRate[1]) / 100, (100 - spRate[2]) / 100];
    let spRate4 = Math.pow((1 - (noSP[0] * noSP[1] * noSP[2])), 4);
    let spRateTotal = Math.round(spRate4 * 10000) / 100;
    
    return (
        <div className="selected-cards">
            <div className="section-header">Support Deck</div>
            <div className="section-explanation">
                The cards you're using. Click one to remove it, and click one in the tier list to add it.
            </div>
            {cards}
            <br />
            <br />
            <br />
            <br />
            <div>
                SP Lesson Rate: <b>{spRate[0]}%</b>/<b>{spRate[1]}%</b>/<b>{spRate[2]}%</b> - Probably of at least 1 SP Lesson each week (Master): <b>{spRateTotal}</b>% <br />
                Starting P Points: <b>{pPoints}</b>
            </div>
            {/*
            <div>
                Examples:
                <button className="btn-preset" onClick={() => props.onLoadPreset([10001, 10002, 10003, 10004, 10005])}>Dance/Voice (4 Gift, 2 Shop)</button>
                <button className="btn-preset" onClick={() => props.onLoadPreset([10001, 10002, 10003, 10004, 10005])}>Dance/Visual (1 Gift, 1 Shop, 4 Rest)</button>
                <button className="btn-preset" onClick={() => props.onLoadPreset([10001, 10002, 10003, 10004, 10005])}>Dance/Visual (1 Gift, 3 Shop)</button>

            </div>
            */}
        </div>
    );
}

export default SelectedCards;