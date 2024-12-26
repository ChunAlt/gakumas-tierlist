import React from 'react';

function SupportCard(props) {
    const alreadySelected = props.selected.indexOf(props.charName) > -1;

    return (
        <div className="signature">
            <img
                className="signature"
                name={props.id}
                src={process.env.PUBLIC_URL + "/signatureImages/signature_card_s_" + props.id + ".png"}
                title={props.charName}
                alt={props.charName}
            />           
        </div>
    );
}

export default SupportCard;