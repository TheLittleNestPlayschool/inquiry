/* ==========================================
   INQUIRY CARDS
========================================== */

import {
    inquiryPanel
} from './inquiry_elements.js';

import {
    hideEmptyState
} from './inquiry_state_ui.js';

import {
    formatElapsedTime
} from './inquiry_timer_ui.js';

import {
    createInquiryGauge,
    updateInquiryGauge
} from './inquiry_gauge_ui.js';


/* ==========================================
   UPDATE CARD TIMER + GAUGE
========================================== */

export function updateCardTimer(
    card,
    timestamp
){

    const timer =
        card.querySelector(
            '.inquiry-card-timer'
        );


    if(timer){

        timer.textContent =
            formatElapsedTime(
                timestamp
            );

    }


    updateInquiryGauge(
        card,
        timestamp
    );

}


/* ==========================================
   CREATE INQUIRY CARD
========================================== */

export function addInquiryCard(
    inquiry,
    franchiseName
){

    hideEmptyState();


    const card =
        document.createElement(
            'article'
        );


    card.className =
        'inquiry-card';


    card.dataset.id =
        inquiry.id;


    card.dataset.lastActivity =
        inquiry.last_activity_at ||
        0;


    /* ======================================
       CARD CONTENT
    ====================================== */

    const content =
        document.createElement(
            'div'
        );


    content.className =
        'inquiry-card-content';


    /* ======================================
       PARENT NAME
    ====================================== */

    const name =
        document.createElement(
            'h3'
        );


    name.className =
        'inquiry-card-name';


    name.textContent =
        inquiry.parent_name;


    content.appendChild(
        name
    );


    /* ======================================
       FRANCHISE / BRANCH
    ====================================== */

    const branch =
        document.createElement(
            'div'
        );


    branch.className =
        'inquiry-card-branch';


    branch.textContent =
        franchiseName;


    content.appendChild(
        branch
    );


    /* ======================================
       ELAPSED TIME
    ====================================== */

    const timer =
        document.createElement(
            'div'
        );


    timer.className =
        'inquiry-card-timer';


    timer.textContent =
        formatElapsedTime(
            inquiry.last_activity_at
        );


    content.appendChild(
        timer
    );


    /* ======================================
       GAUGE
    ====================================== */

    const gauge =
        createInquiryGauge(
            inquiry.last_activity_at
        );


    /* ======================================
       BUILD CARD
    ====================================== */

    card.appendChild(
        content
    );


    card.appendChild(
        gauge
    );


    inquiryPanel.appendChild(
        card
    );


    return card;

}
