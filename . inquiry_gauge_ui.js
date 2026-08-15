/* ==========================================
   THREE-HOUR GAUGE
========================================== */

/*
    The gauge represents 3 hours.

    3 = top
    1 = 4 o'clock
    2 = 8 o'clock

    The hand completes one full rotation
    every 3 hours.
*/

import {
    getElapsedMilliseconds
} from './inquiry_timer_ui.js';


/* ==========================================
   GAUGE ROTATION
========================================== */

function getGaugeRotation(
    timestamp
){

    const elapsed =
        getElapsedMilliseconds(
            timestamp
        );


    const threeHours =
        3 *
        60 *
        60 *
        1000;


    if(
        elapsed >=
        threeHours
    ){

        return 360;

    }


    return (
        elapsed /
        threeHours
    ) *
    360;

}


/* ==========================================
   CREATE GAUGE
========================================== */

export function createInquiryGauge(
    timestamp
){

    const gauge =
        document.createElement(
            'div'
        );


    gauge.className =
        'inquiry-gauge';


    gauge.setAttribute(
        'aria-hidden',
        'true'
    );


    const face =
        document.createElement(
            'div'
        );


    face.className =
        'inquiry-gauge-face';


    /* ======================================
       3 — TOP
    ====================================== */

    const label3 =
        document.createElement(
            'span'
        );


    label3.className =
        'gauge-label gauge-label-3';


    label3.textContent =
        '3';


    /* ======================================
       1 — 4 O'CLOCK
    ====================================== */

    const label1 =
        document.createElement(
            'span'
        );


    label1.className =
        'gauge-label gauge-label-1';


    label1.textContent =
        '1';


    /* ======================================
       2 — 8 O'CLOCK
    ====================================== */

    const label2 =
        document.createElement(
            'span'
        );


    label2.className =
        'gauge-label gauge-label-2';


    label2.textContent =
        '2';


    /* ======================================
       MOVING HAND
    ====================================== */

    const hand =
        document.createElement(
            'span'
        );


    hand.className =
        'inquiry-gauge-hand';


    hand.style.transform =
        `translateX(-50%) rotate(${getGaugeRotation(timestamp)}deg)`;


    /* ======================================
       CENTER PIVOT
    ====================================== */

    const center =
        document.createElement(
            'span'
        );


    center.className =
        'inquiry-gauge-center';


    /* ======================================
       BUILD GAUGE
    ====================================== */

    face.appendChild(
        label3
    );

    face.appendChild(
        label1
    );

    face.appendChild(
        label2
    );

    face.appendChild(
        hand
    );

    face.appendChild(
        center
    );


    gauge.appendChild(
        face
    );


    return gauge;

}


/* ==========================================
   UPDATE GAUGE
========================================== */

export function updateInquiryGauge(
    card,
    timestamp
){

    const hand =
        card.querySelector(
            '.inquiry-gauge-hand'
        );


    if(hand){

        hand.style.transform =
            `translateX(-50%) rotate(${getGaugeRotation(timestamp)}deg)`;

    }

}
