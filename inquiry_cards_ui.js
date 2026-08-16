/* ==========================================
   INQUIRY CARDS
========================================== */

import {
    inquiryPanel
} from './inquiry_elements.js';

import {
    hideEmptyState,
    showEmptyState
} from './inquiry_state_ui.js';

import {
    formatElapsedTime
} from './inquiry_timer_ui.js';

import {
    createInquiryGauge,
    updateInquiryGauge
} from './inquiry_gauge_ui.js';

import {
    openInquiryWorkspace
} from './inquiry_workspace.js';


/* ==========================================
   API
========================================== */

const CLOSE_INQUIRY_API =
    'https://x8ki-letl-twmt.n7.xano.io/api:U9BIDXtD/qna_inquiry_history_close';


/* ==========================================
   AUTH
========================================== */

function getAuthToken(){

    return localStorage.getItem(
        'authToken'
    );

}


/* ==========================================
   CLOSE INQUIRY
========================================== */

async function closeInquiry(
    card,
    inquiryId,
    closeButton
){

    const authToken =
        getAuthToken();


    if(!authToken){

        alert(
            'Your login session could not be found. Please log in again.'
        );

        return;

    }


    closeButton.disabled =
        true;

    closeButton.textContent =
        'Closing...';


    try{

        const response =
            await fetch(
                CLOSE_INQUIRY_API,
                {
                    method:
                        'POST',

                    headers:{
                        'Content-Type':
                            'application/json',

                        'Accept':
                            'application/json',

                        'Authorization':
                            `Bearer ${authToken}`
                    },

                    body:
                        JSON.stringify({
                            inquiry_id:
                                Number(
                                    inquiryId
                                )
                        })
                }
            );


        if(!response.ok){

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                `Unable to close inquiry. HTTP ${response.status}`
            );

        }


        await response.json();


        /* ==================================
           REMOVE CARD
        ================================== */

        card.remove();


        /* ==================================
           SHOW EMPTY STATE IF LAST CARD
        ================================== */

        const remainingCards =
            inquiryPanel.querySelectorAll(
                '.inquiry-card'
            );


        if(
            remainingCards.length === 0
        ){

            showEmptyState();

        }

    }
    catch(error){

        console.error(
            'Close inquiry failed:',
            error
        );


        alert(
            'Unable to close the inquiry. Please try again.'
        );


        closeButton.disabled =
            false;

        closeButton.textContent =
            'Close';

    }

}


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
       OPEN WORKSPACE
    ====================================== */

    card.addEventListener(
        'click',
        () => {

            openInquiryWorkspace(
                {
                    ...inquiry,
                    franchise_name:
                        franchiseName
                }
            );

        }
    );


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
       CLOSE BUTTON
    ====================================== */

    const closeButton =
        document.createElement(
            'button'
        );


    closeButton.type =
        'button';


    closeButton.className =
        'inquiry-card-close';


    closeButton.textContent =
        'Close';


    closeButton.addEventListener(
        'click',
        event => {

            event.stopPropagation();


            closeInquiry(
                card,
                inquiry.id,
                closeButton
            );

        }
    );


    content.appendChild(
        closeButton
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
